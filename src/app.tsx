import { RunTimeLayoutConfig } from "umi";
import React from "react";
import type { InitialState } from "@/types";
import { PageContainer } from "@ant-design/pro-layout";
import Footer from "@/components/Footer";
import HeaderDropdown from "@/components/HeaderDropdown";
import requestConfig from "@/requestConfig";
import defaultSettings from "../config/defaultSettings";

export async function getInitialState(): Promise<InitialState> {
  return {
    username: "Admin",
    logo: "https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg",
    isLogin: true,
  };
}

// 全局布局,修改一些默认配置
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      src: initialState?.logo,
      size: "small",
      title: initialState?.username,
      render: (_, children) => <HeaderDropdown children={children} />,
    },
    childrenRender: (children) => <PageContainer content={children} className="h-full" />,
    footerRender: () => <Footer />,
    ...defaultSettings,
  };
};

export const request = requestConfig;
