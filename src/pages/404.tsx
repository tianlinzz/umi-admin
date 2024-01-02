import React from "react";
import { Result } from "antd";

export default () => (
  <div className="flex h-full items-center justify-center">
    <Result status="404" subTitle="对不起，您访问的页面不存在。" />
  </div>
);
