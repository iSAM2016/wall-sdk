import { ErrorInterface } from "./error";
export type EventType = {
  NORMALERROR: "NORMALERROR";
  PROMISEERROR: "PROMISEERROR";
  XHR: "xhr";
};

export interface BaseInfoInterface {
  createTime: number;
  type: keyof EventType;
  info: any;
}
