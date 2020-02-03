import { InfoInterface } from "./baseInfo";

export interface URLInfoInterface extends InfoInterface {
  message: string;
  oldURL: string;
  newURL: string;
}

export interface XpathInterface extends InfoInterface {
  message: string;
  xpath: string;
  inputValue: string;
  placeholder: string;
  className: string;
}
export interface CustomBehavior extends InfoInterface {
  message: string;
  behaviorType: string;
  behaviorResult: object;
}
