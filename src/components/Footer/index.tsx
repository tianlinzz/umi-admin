import { DefaultFooter } from "@ant-design/pro-components";
import React from "react";

const Footer: React.FC = () => {
  const defaultMessage = "System";
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: "none",
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
      }}
      copyright={`${currentYear} ${defaultMessage}`}
    />
  );
};
export default Footer;
