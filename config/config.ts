import { defineConfig } from "umi";
import routes from "./route";

export default defineConfig({
  routes,
  hash: true,
  fastRefresh: true,
  headScripts: [
    // 解决首次加载时白屏的问题
    {
      src: "/scripts/loading.js",
      async: true,
    },
  ],
  plugins: [
    "@umijs/plugins/dist/react-query",
    "@umijs/plugins/dist/initial-state",
    "@umijs/plugins/dist/model",
    "@umijs/plugins/dist/dva",
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/antd",
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/layout",
    "@umijs/max-plugin-openapi",
  ],
  reactQuery: {},
  dva: {
    immer: {},
    extraModels: [],
  },
  initialState: {},
  model: {},
  request: {
    // 方便 useRequest 直接消费数据
    dataField: "data",
  },
  antd: {
    theme: {
      token: {
        fontSize: 16,
      },
    },
    compact: true,
    style: "less",
    appConfig: {},
    // Transform DayJS to MomentJS
    momentPicker: true,
    styleProvider: {
      hashPriority: "high",
      legacyTransformer: true,
    },
  },
  tailwindcss: {},
  layout: {
    // 关闭国际化
    locale: false,
    title: "System",
  },
  npmClient: "yarn",
  // 引入 tailwindcss
  extraPostCSSPlugins: [require("tailwindcss")],
  alias: {
    "@": require("path").resolve(__dirname, "src"),
  },
  openAPI: {
    requestLibPath: "import { request } from 'umi'", // 请求方法路径
    schemaPath: "http://127.0.0.1:8081/api/v2/api-docs", // 接口文档地址
    projectName: "test", // 项目名称
    namespace: "API", // 命名空间名称 默认值 API
  },
});
