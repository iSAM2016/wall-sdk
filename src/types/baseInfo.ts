export type EventType = {
  NORMALERROR: "NORMALERROR";
  PROMISEERROR: "PROMISEERROR";
  CONSOLEERRR: "CONSOLEERRR";
  CUSTOMERROR: "CUSTOMERROR";
  IMAGEERROR: "IMAGEERROR";
  XHRERROR: "XHRERROR";
  XHR: "xhr";
};

export interface BaseInfoInterface {
  info: any;
  type: keyof EventType;
  createTime?: number;
}
