import { extend, RequestOptionsInit, ResponseError } from "umi-request";
import { message } from "antd";
import { stringify as qsStringify } from "qs";
import { LONGIN_URL } from "@/constants";

interface RequestOptions extends RequestOptionsInit {
  url: string;
  method?: "get" | "post" | "put" | "delete" | "GET" | "POST" | "PUT" | "DELETE";
}

const codeMessage: Record<number, string> = {
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

const errorHandler = async (error: ResponseError) => {
  console.log(error);
  const { response, data = {} as any } = error;
  const { status = 400 } = response || {};
  const errorText = data.message || codeMessage[status] || "未知错误";
  await message.error(errorText);
  if (status === 401 || data.code === 40100) {
    // 与后端约定的登录失效状态码， 401为默认的登录失效状态码
    localStorage.clear();
    window.location.href = "/login";
  }
  throw new Error(errorText);
};

const request = extend({
  errorHandler,
  timeout: 10000,
  paramsSerializer: (params: any) => {
    return qsStringify(params, { arrayFormat: "repeat" });
  },
});

const requestInterceptor = (url: string, options: RequestOptionsInit) => {
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
};

const responseInterceptor = async (response: Response) => {
  const res = await response.clone().json();
  const error = {
    data: res,
    response: response,
    type: "",
  };
  // 与后端约定的成功状态码
  if (res.code !== 0) {
    error.type = "requestError";
    return Promise.reject(error);
  }
  return res.data;
};

request.interceptors.request.use(requestInterceptor);
request.interceptors.response.use(responseInterceptor);

const generalRequest = <T>(options: RequestOptions, prefix: string = ""): Promise<T> => {
  const { url, method = "get", ...restOptions } = options;

  const requestUrl = `${prefix}${url}`;

  switch (method.toUpperCase()) {
    case "POST":
      return request.post<T>(requestUrl, restOptions);
    case "PUT":
      return request.put<T>(requestUrl, restOptions);
    case "DELETE":
      return request.delete<T>(requestUrl, restOptions);
    default:
      return request.get<T>(requestUrl, restOptions);
  }
};

export const loginRequest = <T = any>(options: RequestOptions) => {
  return generalRequest<T>(options, LONGIN_URL);
};
