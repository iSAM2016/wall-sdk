import { BaseInfoInterface, EventType } from "./baseInfo";
export interface ErrorInterface extends BaseInfoInterface {
  createTime: number;
  type: keyof EventType;
  info: {
    message?: string | Object; // 错误信息（字符串
  };
}
