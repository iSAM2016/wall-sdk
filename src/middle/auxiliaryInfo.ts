import { BaseInfoInterface, NextInterface } from "@app/types";
export const auxiliaryInfo = (
  event: BaseInfoInterface,
  next: NextInterface
) => {
  event.key = Math.random()
    .toString(36)
    .substring(2);
  event.createTime = +new Date();
  next();
};
