import { BaseInfoInterface } from "./baseInfo";

export interface XhrInfoInterface extends BaseInfoInterface {
  type: "XHR";
  info: object;
  url: string;
  method: Function;
  status: number;
  success?: boolean;
  duration?: number;
  statusText?: string;
  responseSize?: string;
  requestDate?: object; //TODO: 加密方法
}
