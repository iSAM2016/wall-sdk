import { BaseInfoInterface } from "./baseInfo";

export interface XhrInfoInterface extends BaseInfoInterface {
  type: "BEHAVIORXHR";
  info: object;
  url: string;
  method: Function;
  status: number;
  success?: boolean;
  duration?: number;
  statusText?: string;
  responseSize?: string;
  requestDate?: object;
}
