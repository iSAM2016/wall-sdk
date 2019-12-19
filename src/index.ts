import Application from "@app/core/wall";
import { EngineInterface } from "@app/types";

import TryCatch from "./integrations/trycatch";

let wall = Application(); // app 是监听函数

wall.use(function(event, next) {
  // console.log("我是中间件1");
  console.log(event);
  next();
});

wall.use(function(event, next) {
  // console.log(event);
  next();
});

wall.listen([new TryCatch(wall)]);

(window as any).WALL = wall;
export default wall;
