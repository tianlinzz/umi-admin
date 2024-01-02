interface BestAFSRoute {
  path: string; // 路由路径
  redirect?: string; // 重定向
  component?: string; // 路由组件, src/pages/ 下的文件路径
  routes?: BestAFSRoute[]; // 子路由
  name?: string; // 路由名称
  icon?: string; // 路由图标
  layout?: boolean; // 是否使用布局，只在一级路由中生效
  hideInMenu?: boolean; // 是否在菜单中隐藏
  exact?: boolean; // 是否精确匹配
  wrappers?: string[]; // 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。
  access?: string; // 路由权限
  hideChildrenInMenu?: boolean; // 是否在菜单中隐藏子路由
  flatMenu?: boolean; // 子项往上提，仍旧展示,
  headerRender?: boolean; // 是否渲染头部
  footerRender?: boolean; // 是否渲染底部
}

const routes: BestAFSRoute[] = [
  {
    path: "/login",
    component: "./Login",
    name: "登录",
    layout: false,
  },
  {
    path: "/welcome",
    component: "../Welcome",
    name: "欢迎",
    icon: "smile",
    hideInMenu: true,
  },
  {
    path: "/topics",
    name: "浏览题目",
    icon: "HomeOutlined",
    component: "./BrowseTopics",
  },
  {
    path: "/my",
    component: "./AboutMe",
    name: "关于我的",
    icon: "UserOutlined",
  },
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    path: "*",
    component: "./404",
  },
];

export default routes;
