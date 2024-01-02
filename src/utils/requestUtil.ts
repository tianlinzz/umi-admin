import { extend, RequestMethod, RequestOptionsInit, ResponseError } from "umi-request";
import { message } from "antd";
import { stringify as qsStringify } from "qs";
import { LONGIN_URL, UPLOAD_URL } from "@/constants";
import moment from "moment";

interface RequestOptions extends RequestOptionsInit {
  url: string;
}

/**
 * @description: 请求工具类
 * @param {string} prefix 请求前缀
 * @return {get, post, put, delete} 请求方法
 */
class RequestUtil {
  private readonly requestInstance: RequestMethod;
  private readonly codeMessage: Record<number, string> = {
    200: "服务器成功返回请求的数据。",
    201: "新建或修改数据成功。",
    202: "一个请求已经进入后台排队（异步任务）。",
    204: "删除数据成功。",
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "未登录或登录已过期，请重新登录。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
  };

  constructor(prefix: string) {
    this.requestInstance = extend({
      prefix,
      errorHandler: this.errorHandler.bind(this),
      timeout: 10000,
      paramsSerializer: (params: any) => {
        return qsStringify(params, { arrayFormat: "repeat" });
      },
    });
    this.requestInstance.interceptors.request.use(this.requestInterceptor.bind(this));
    this.requestInstance.interceptors.response.use(this.responseInterceptor.bind(this));
  }

  private printErrorInfo(error: ResponseError, errorText: string) {
    const { request, response } = error || {};
    const { url, options } = request || {};
    const { status = 404 } = response || {};
    const { method, headers, params, data } = options || {};
    const paramsKeys = Object.keys(params || {});
    const tempParams = paramsKeys && paramsKeys.length ? params : data;

    const errorTagStyle = [
      "color: #ff4d4f",
      "background: #fff2f0",
      "padding: 2px 6px",
      "font-size: 12px",
      "border-radius: 2px",
      "border: 1px solid #ff4d4f",
    ].join(";");

    console.log("%c接口报错信息", errorTagStyle);
    console.log(`
    ------------- error-start -------------
      时间：${moment().format("YYYY-MM-DD HH:mm:ss")}
      HTTP Status：${status || 404}
      接口路径：${url}
      请求类型：${method}
      headers：${JSON.stringify(headers)}
      参数：${JSON.stringify(tempParams || {})}
      code：${data?.code || 404}
      message：${errorText}
    ------------- error-end ---------------
  `);
  }

  private async errorHandler(error: ResponseError) {
    console.log(JSON.stringify(error));
    const { response } = error;
    const { status = 404, statusText = "请求错误" } = response || {};
    const errorText = this.codeMessage[status] || statusText;
    message.error(errorText);
    this.printErrorInfo(error, errorText);
    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  private requestInterceptor(url: string, options: RequestOptionsInit) {
    const token = localStorage.getItem("token");
    const { headers = {} } = options || {};
    const tokenHeaders = {
      tokenId: token,
      ...headers,
    };

    if (options.method?.toUpperCase() === "GET") {
      options.params = options.data;
    } else {
      options.requestType = options.requestType ? options.requestType : "json";
    }

    if (token) {
      return {
        url,
        options: { ...options, tokenHeaders },
      };
    }
    return {
      url,
      options: { ...options },
    };
  }

  private async responseInterceptor(response: Response) {
    const data = await response.clone().json();
    if (!data.success) {
      return Promise.reject(data);
    }
    return data;
  }

  public get<T = any>(options: RequestOptions): Promise<T> {
    const { url, ...rest } = options;
    return this.requestInstance.get(url, rest);
  }

  public post<T = any>(options: RequestOptions): Promise<T> {
    const { url, ...rest } = options;
    return this.requestInstance.post(url, rest);
  }

  public put<T = any>(options: RequestOptions): Promise<T> {
    const { url, ...rest } = options;
    return this.requestInstance.put(url, rest);
  }

  public delete<T = any>(options: RequestOptions): Promise<T> {
    const { url, ...rest } = options;
    return this.requestInstance.delete(url, rest);
  }
}

export const loginRequest = new RequestUtil(LONGIN_URL);
export const uploadRequest = new RequestUtil(UPLOAD_URL);

export default {
  loginRequest,
  uploadRequest,
};
