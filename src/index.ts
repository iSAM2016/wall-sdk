import Application from "@app/core/wall";
import { EngineInterface } from "@app/types";

import TryCatch from "./integrations/trycatch";

let wall = Application(); // app 是监听函数

wall.use(function(event, next) {
  // console.log("我是中间件1");
  //   console.log(event);
  next("我是错误");
});

wall.use(function(err, event, next) {
  // console.log("我是中间件2");
  console.log(event);
  next();
});

wall.listen([new TryCatch(wall)]);

export default wall;
