import { extend, RequestOptionsInit, ResponseError } from "umi-request";
import { message } from "antd";
import { stringify as qsStringify } from "qs";
import { LONGIN_URL, UPLOAD_URL } from "@/constants";

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
  const { response, data } = error;
  const { status = 200, statusText = "请求错误" } = response || {};
  const errorText = codeMessage[status] || statusText;
  if (status === 200) {
    const res = await response?.clone().json();
    if (res.code === 40100) {
      localStorage.clear();
      window.location.href = "/login";
    }
    message.error(error.message || "请求错误!");
  } else if (status === 401) {
    message.error("登录已过期，请重新登录");
    localStorage.clear();
    window.location.href = "/login";
  } else {
    message.error(errorText);
  }
  return Promise.reject(data);
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
  if (res.code !== 0) {
    return Promise.reject({
      ...res,
      response: response,
    });
  }
  return res.data;
};

request.interceptors.request.use(requestInterceptor);
request.interceptors.response.use(responseInterceptor);

const generalRequest = (options: RequestOptions, prefix: string = "") => {
  const { url, method = "get", ...restOptions } = options;

  const requestUrl = `${prefix}${url}`;

  switch (method.toUpperCase()) {
    case "POST":
      return request.post(requestUrl, restOptions);
    case "PUT":
      return request.put(requestUrl, restOptions);
    case "DELETE":
      return request.delete(requestUrl, restOptions);
    default:
      return request.get(requestUrl, restOptions);
  }
};

export const loginRequest = (options: RequestOptions) => {
  return generalRequest(options, LONGIN_URL);
};

export const uploadRequest = (options: RequestOptions) => {
  return generalRequest(options, UPLOAD_URL);
};
