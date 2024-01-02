/**
 * 一个 Model 文件，需要导出一个 hook 函数，函数返回一个对象。
 */
export default function userModel() {
  const user = {
    username: "umi",
  };

  return { user };
}
