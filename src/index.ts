import Application from "@app/core/wall";
import { AppInterface } from "@app/types";
import TryCatch from "@app/integrations/trycatch";
import Behavior from "@app/integrations/behavior";
import resources from "@app/integrations/resources";
import Xhr from "@app/integrations/xhr";
import { auxiliaryInfo, frequency } from "@app/middle";
import * as localForage from "localforage";

let wall: AppInterface = Application();
// 添加时间和key和UA
wall.use(auxiliaryInfo);

// 对所有的ERROR设置上报频率
wall.use(frequency);

//对所有RESCOURCE 资源每页每天上报一次
wall.use(function(event, next) {
  next();
});

//对所有ERROR BEHAVIORC 数据记录
wall.use(function(event, next) {
  next();
});

// 对当前event有upload属性并且为true的
// 取出历史前四条
//立即上报
wall.use(function(event, next) {
  localForage
    .setItem("key", "value")
    .then(function() {
      return localForage.getItem("key");
    })
    .then(function(value) {
      // we got our value
    })
    .catch(function(err) {
      // we got an error
    });

  next();
});

wall.listen([
  new TryCatch(wall),
  new Xhr(wall),
  new Behavior(wall),
  resources(wall)
]);

window.WALL = wall;

export default wall;
