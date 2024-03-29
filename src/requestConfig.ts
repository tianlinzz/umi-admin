import { AxiosResponse, history, RequestConfig } from "umi";
import { message, notification } from "antd";
import { ADMIN_URL } from "@/constants";
import type { RequestOptions } from "@@/plugin-request/request";

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * umi4 的 request 插件配置
 */
const requestConfig: RequestConfig = {
  // 统一的请求设定
  baseURL: ADMIN_URL,
  timeout: 1000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
  withCredentials: true,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = "BizError";
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: async (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === "BizError") {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error("None response! Please retry.");
      } else {
        // 业务代码抛出的错误
        message.error(error);
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      //处理 headers
      const token = localStorage.getItem("token");
      if (token) {
        config.headers!["Authorization"] = `Bearer ${token}`;
      }
      // 允许在请求头中携带 cookie
      config.credentials = "include";
      // 允许跨域
      config.headers = {
        ...config.headers,
        "Access-Control-Allow-Origin": "*",
      };
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.code === 40100) {
        history.replace("/login");
        return Promise.reject(data.message);
      }

      if (data?.code !== 0) {
        return Promise.reject(data.message);
      }

      return data;
    },
  ],
};

export default requestConfig;
