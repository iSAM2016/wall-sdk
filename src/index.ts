import Application from "@app/core/wall";
import { AppInterface } from "@app/types";
import TryCatch from "./integrations/trycatch";
import Xhr from "./integrations/xhr";

let wall: AppInterface = Application();

wall.use(function(event, next) {
  console.log("我是中间件1");
  console.log(event);
  next();
});

wall.use(function(event, next) {
  // console.log(event);
  next();
});

wall.listen([new TryCatch(wall), new Xhr(wall)]);

window.WALL = wall;
export default wall;
