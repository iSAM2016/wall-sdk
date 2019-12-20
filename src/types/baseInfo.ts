import { OptionsInterface } from "./options";
export type EventType = {
  NORMALERROR: "NORMALERROR"; // 普通错误
  PROMISEERROR: "PROMISEERROR"; // peomise error
  CONSOLEERRR: "CONSOLEERRR"; // console.error
  CUSTOMERROR: "CUSTOMERROR"; // 用户自定义错误
  IMAGEERROR: "IMAGEERROR"; // 图片加载错误
  XHRERROR: "XHRERROR"; // xhrerror
  BEHAVIORCLICK: "BEHAVIORCLICK"; // 用户点击
  BEHAVIORURLCHANGE: "BEHAVIORURLCHANGE"; // 路由改变
  BEHAVIORXPATH: "BEHAVIORXPATH"; // 用户点击
  BEHAVIORXHR: "BEHAVIORXHR"; // 用户请求
  RESCOURCES: "RESCOURCES"; // 资源
};

export interface BaseInfoInterface {
  info: any;
  type: keyof EventType;
  key?: string;
  options?: OptionsInterface;
  isUpload?: boolean; // 是否上报
  createTime?: number;
}
