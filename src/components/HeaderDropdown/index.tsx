import React from "react";
import { Dropdown, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { history } from "@@/core/history";

const HeaderDropdown = ({ children }: { children: React.ReactNode }) => {
  const DropdownHandler = async ({ key }: { key: string }) => {
    console.log(key);
    if (key === "logout") {
      localStorage.clear();
      history.replace("/login");
      message.success("退出成功");
    }
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "退出登录",
          },
        ],
        onClick: DropdownHandler,
      }}
    >
      {children}
    </Dropdown>
  );
};

export default HeaderDropdown;
