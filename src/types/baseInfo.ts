import { ErrorInterface } from "./error";
export type EventType = {
  NORMALERROR: "NORMALERROR";
  PROMISEERROR: "PROMISEERROR";
  CONSOLEERRR: "CONSOLEERRR";
  CUSTOMERROR: "CUSTOMERROR";
  IMAGEERROR: "IMAGEERROR";
  XHR: "xhr";
};

export interface BaseInfoInterface {
  type: keyof EventType;
  info: any;
}
