import Wall from "./index";
// h5  版本
Wall.init({
  token: String(9999),
  frequency: 0.5,
  // 请求参数加密
  paramEncryption: value => {
    return JSON.stringify(value);
  }
});
