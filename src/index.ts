import Application from "@app/core/wall";
import { EngineInterface } from "@app/types";
import TryCatch from "./integrations/trycatch";
import Xhr from "./integrations/xhr";

let wall = Application(); // TODO: app 的interface

wall.use(function(event, next) {
  // console.log("我是中间件1");
  console.log(event);
  next();
});

wall.use(function(event, next) {
  // console.log(event);
  next();
});

wall.listen([new TryCatch(wall), new Xhr(wall)]);

(window as any).WALL = wall; //TODO: window声明
export default wall;
