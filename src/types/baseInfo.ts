import { OptionsInterface } from "./options";
import { DeviceInterface } from "./device";
export type EventType = {
  NORMALERROR: "NORMALERROR"; // 普通错误
  PROMISEERROR: "PROMISEERROR"; // peomise error
  CONSOLEERRR: "CONSOLEERRR"; // console.error
  CUSTOMERROR: "CUSTOMERROR"; // 用户自定义错误
  SOURCEERROR: "SOURCEERROR"; // 静态资源img script link加载错误
  XHRERROR: "XHRERROR"; // xhrerror
  BEHAVIORCLICK: "BEHAVIORCLICK"; // 用户点击
  BEHAVIORURLCHANGE: "BEHAVIORURLCHANGE"; // 路由改变
  BEHAVIORXPATH: "BEHAVIORXPATH"; // 用户点击
  BEHAVIORXHR: "BEHAVIORXHR"; // 用户请求
  BEHAVIORFETCH: "BEHAVIORFETCH"; // 用户请求
  BEHAVIORCUSTOM: "BEHAVIORCUSTOM"; // 用户自定行为
  RESCOURCES: "RESCOURCES"; // 资源
};

export interface EventInterface {
  type: keyof EventType;
  info: InfoInterface; // 业务信息 error 信息 行为信息
  key?: string; // 每个event 都有自己的 唯一key
  isUpload?: boolean; // 是否立即上报
  currentUrl?: string; // 页面url
  version?: number;
  createTime?: number; // event创建时间
  options?: OptionsInterface; // wall 初始化信息
  deviceInfo?: DeviceInterface;
}

export interface InfoInterface {
  message: string;
}
