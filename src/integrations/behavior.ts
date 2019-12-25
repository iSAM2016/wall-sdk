/*
 * 用户行为
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-19 15:22:10
 */
import {
  EventInterface,
  EngineInterface,
  AppInterface,
  XpathInterface,
  CustomBehavior
} from "@app/types";
import { addEventListener } from "../util";
class Behavior implements EngineInterface {
  WALL: AppInterface;
  constructor(wall: AppInterface) {
    this.WALL = wall;
    this.listenerClick();
    this.customBehavior();
  }

  private listenerClick() {
    let self = this;
    document.addEventListener(
      "click",
      function(e: Event) {
        let xpath: string = self.getXpath(e.target);
        let inputValue: string = (e.target as HTMLInputElement).value || "";
        let placeholder: string =
          (e.target as HTMLInputElement).placeholder || "";
        let className: string = (e.target as any).className;

        if (inputValue.length > 20) {
          inputValue = inputValue.substring(0, 20);
        }
        if (xpath) {
          let xpathInfo: XpathInterface = {
            message: "用户路径",
            xpath,
            inputValue,
            placeholder,
            className
          };
          let behaviorInfo: EventInterface = {
            type: "BEHAVIORXPATH",
            info: xpathInfo
          };
          self.WALL(behaviorInfo);
        }
      },
      false
    );
  }
  private getXpath = element => {
    if (!(element instanceof Element)) {
      return "";
    }
    if (element.nodeType !== 1) {
      return "";
    }
    let rootElement = document.body;
    if (element === rootElement) {
      return "";
    }
    let tagName = element.tagName.toLocaleLowerCase();
    if (tagName === "html" || tagName === "body") {
      return "";
    }
    let xpath: string = "";

    while (element !== document) {
      let tag = element.tagName.toLocaleLowerCase();
      xpath = "/" + tag + xpath;
      element = element.parentNode;
    }
    return xpath;
  };

  public customBehavior() {
    /**
     * 用户自定义行为
     * @param behaviorType  行为类型
     * @param behaviorResult  行为结果
     * @param description 行为描述
     */
    this.WALL.createCustomBehaviorEvent = (
      behaviorType: string,
      behaviorResult: object,
      message: string
    ) => {
      let customBehavior: CustomBehavior = {
        message,
        behaviorType,
        behaviorResult
      };
      let behaviorInfo: EventInterface = {
        type: "BEHAVIORCUSTOM",
        info: customBehavior
      };
      self.WALL(behaviorInfo);
    };
  }
}

export default Behavior;
