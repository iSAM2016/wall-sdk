import { BaseInfoInterface, EventType } from "./baseInfo";
export interface ErrorInterface extends BaseInfoInterface {
  createTime: number;
  type: keyof EventType;
  info: {
    message?: string; // 错误信息（字符串
    col?: number;
    row?: number;
    name?: string;
    content?: string;
    errorMessage?: string;
    scriptURI?: string;
    lineNumber?: number;
    columnNumber?: number;
    errorObj?: any;
    _errorMessage?: string | Event; // 标准信息
    _scriptURI?: string | Event; //发生错误的脚本URL（字符串
    _lineNumber?: number | Event; //发生错误的行号
    _columnNumber?: number | Event;
    resourceUrl?: string;
  };
}
