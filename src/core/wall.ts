import {
  AppInterface,
  NextInterface,
  EngineInterface,
  OptionsInterface,
  BaseInfoInterface,
  MiddleHandlerInterface,
  MiddleOptionsInterface,
  ApplicationInterface
} from "@app/types";

let Application = <ApplicationInterface>function() {
  //   最常用的是向 event 添加东西
  let app = <AppInterface>function(event: BaseInfoInterface) {
    // createTime: +new Date(),
    // 计数器
    let index: number = 0;
    let next: NextInterface = (error?: string) => {
      let layer: MiddleOptionsInterface = app.routes[index++];
      if (layer) {
        if (error) {
          //  如果有错误，需要走错误接口
          if (layer.method === "middle" && layer.handler.length === 3) {
            return layer.handler(event, next, error);
          } else {
            next(error);
          }
        } else {
          if (layer.method === "middle") {
            if (layer.pathname === "/") {
              return layer.handler(event, next);
            } else {
              next();
            }
          }
        }
      }
    };
    // 首次执行;
    next();
  };
  app.options = {
    token: "",
    paramEncryption: any => any
  };
  app.routes = [];
  // 中间件
  app.use = (handler: MiddleHandlerInterface) => {
    app.routes.push({
      method: "middle",
      pathname: "/",
      handler
    } as MiddleOptionsInterface);
    return this;
  };
  app.listen = function(instance: Array<EngineInterface>) {
    // 待定
  };
  // 初始化参数
  app.init = (options: OptionsInterface) => {
    // TODO: 参数校验
    app.options = options;
  };
  return app;
};

export default Application;
