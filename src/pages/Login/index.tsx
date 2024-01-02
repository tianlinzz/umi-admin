import { LockOutlined, MobileOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
} from "@ant-design/pro-components";
import { Tabs, message, theme } from "antd";
import { useState } from "react";

type LoginType = "phone" | "account";

export default () => {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { token } = theme.useToken();

  const items = [
    { label: "账户密码登录", key: "account" },
    { label: "手机号登录", key: "phone" },
  ];

  const handleFinish = async (values: any) => {
    console.log(values);
  };

  return (
    <ProConfigProvider dark>
      <div className="h-screen bg-white">
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title="登录"
          containerStyle={{
            backgroundColor: "rgba(0, 0, 0,0.65)",
            backdropFilter: "blur(4px)",
          }}
          onFinish={handleFinish}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={items}
          />
          {loginType === "account" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"请输入用户名！"}
                rules={[
                  {
                    required: true,
                    message: "请输入用户名！",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"请输入密码！"}
                rules={[
                  {
                    required: true,
                    message: "请输入密码！",
                  },
                ]}
              />
            </>
          )}
          {loginType === "phone" && (
            <>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: (
                    <MobileOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                name="mobile"
                placeholder={"手机号"}
                rules={[
                  {
                    required: true,
                    message: "请输入手机号！",
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "手机号格式错误！",
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${"获取验证码"}`;
                  }
                  return "获取验证码";
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: "请输入验证码！",
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success("获取验证码成功！");
                }}
              />
            </>
          )}
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};
