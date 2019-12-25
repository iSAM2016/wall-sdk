import Wall from "./index";
// h5  版本
Wall.init({
  origin: "http://baidu.com",
  token: String(9999),
  frequency: 1,
  // 请求参数加密
  paramEncryption: value => {
    return JSON.stringify(value);
  }
});
