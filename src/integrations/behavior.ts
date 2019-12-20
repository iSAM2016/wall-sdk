/*
 * 用户行为
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-19 15:22:10
 */
import {
  BaseInfoInterface,
  EngineInterface,
  AppInterface,
  URLInfoInterface
} from "@app/types";
import { addEventListener } from "../util";
class Behavior implements EngineInterface {
  WALL: AppInterface;
  constructor(wall: AppInterface) {
    this.WALL = wall;
    this.listenerClick();
    this.listenerHashChange();
  }

  private listenerClick() {
    let self = this;
    document.addEventListener(
      "click",
      function(e) {
        let xpath = self.getXpath(e.target);
        if (xpath) {
          let behaviorInfo: BaseInfoInterface = {
            type: "BEHAVIORXPATH",
            info: { message: xpath }
          };
          self.WALL(behaviorInfo);
        }
      },
      false
    );
  }
  private getXpath = element => {
    if (!(element instanceof Element)) {
      return void 0;
    }
    if (element.nodeType !== 1) {
      return void 0;
    }
    let rootElement = document.body;
    if (element === rootElement) {
      return void 0;
    }
    let tagName = element.tagName.toLocaleLowerCase();
    if (tagName === "html" || tagName === "body") {
      return false;
    }
    let xpath: string = "";

    while (element !== document) {
      let tag = element.tagName.toLocaleLowerCase();
      xpath = "/" + tag + xpath;
      element = element.parentNode;
    }
    return xpath;
  };
  /**
   * hansh路由
   */
  private listenerHashChange() {
    if (!("onhashchange" in window.document.body)) {
      return false;
    }
    let self = this;
    let message: URLInfoInterface;
    let currentHashchangeTime: number = 0;
    let currentPopchangeTime: number;
    let behaviorInfo: BaseInfoInterface = {
      type: "BEHAVIORURLCHANGE",
      info: {}
    };
    addEventListener(
      "hashchange",
      (e: HashChangeEvent) => {
        currentHashchangeTime = +new Date();
        message = {
          oldURL: e.oldURL,
          newURL: e.newURL
        };
        return true;
      },
      false
    );

    addEventListener(
      "popstate",
      e => {
        currentPopchangeTime = +new Date();

        setTimeout(() => {
          if (currentPopchangeTime - currentHashchangeTime < 400) {
            behaviorInfo.info.message = message;
            self.WALL(behaviorInfo);
          } else {
            behaviorInfo.info.message = { kl: 0 };
            self.WALL(behaviorInfo);
            console.log(e);
          }
        }, 500);
      },
      false
    );
  }
}

export default Behavior;
