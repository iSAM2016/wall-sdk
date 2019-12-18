//  可以使用中间件来处理相同的逻辑
//  中间件特点：next 1. 决定是否向下执行， 2.event进行扩展（的属性） 3.常见的权限校验
import {
  ApplicationInterface,
  OptionsInterface,
  EngineInterface
} from "@app/types";

// type WALL : {
//   (event: any): void;
//   routes: any[];
//   use(handler: Function): any;
//   listen(methods: EngineInterface[]): void;
//   init(options: OptionsInterface): void;
// }
function Application() {
  //   最常用的是向 req res 添加东西
  function app(event) {
    // 计数器
    let index: number = 0;
    function next(error?) {
      let layer = app.routes[index++];
      //  没有路由错误
      if (layer) {
        if (error) {
          //  如果有错误，需要走错误接口
          if (layer.method === "middle" && layer.handler.length === 3) {
            return layer.handler(error, event, next);
          } else {
            next(error);
          }
        } else {
          //  中间件 把控制权交给用户
          if (layer.method === "middle") {
            // 中间件要匹配路径   1. /user  /user  2./user /  3. /user/b  /user
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
    // 如果 handler 为void  说明 pathname 为 函数
    app.routes.push({ method: "middle", pathname: "/", handler });
    return this;
  };
  app.listen = function(methods: Array<EngineInterface>) {
    // 注册发动机
    methods.forEach(_ => {
      _.createEvent(app);
    });
  };

  // 初始化参数
  app.init = (options: OptionsInterface) => {
    // console.log(options);
  };
  return app;
}

export default Application;
