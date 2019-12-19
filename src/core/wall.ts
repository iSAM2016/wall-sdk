import {
  BaseInfoInterface,
  OptionsInterface,
  EngineInterface
} from "@app/types";

function Application() {
  //   最常用的是向 event 添加东西
  function app(event: BaseInfoInterface) {
    // createTime: +new Date(),
    // 计数器
    let index: number = 0;
    function next(error?) {
      let layer = app.routes[index++];
      if (layer) {
        if (error) {
          //  如果有错误，需要走错误接口
          if (layer.method === "middle" && layer.handler.length === 3) {
            return layer.handler(error, event, next);
          } else {
            next(error);
          }
        } else {
          if (layer.method === "middle") {
            if (layer.pathname === "/") {
              //  把控制交给了用户（实际上是吧next 给了用户）
              return layer.handler(event, next);
            } else {
              next();
            }
          }
        }
      }
    }
    // 首次执行;
    next();
  }
  app.routes = [];
  // 中间件
  app.use = (handler: Function) => {
    app.routes.push({ method: "middle", pathname: "/", handler });
    return this;
  };
  app.listen = function(instance: Array<EngineInterface>) {
    // 待定
  };

  // 初始化参数
  app.init = (options: OptionsInterface) => {
    // console.log(options);
  };
  return app;
}

export default Application;
