import { BaseInfoInterface, NextInterface } from "@app/types";
import { randomKey } from "@app/util";
export const auxiliaryInfo = (
  event: BaseInfoInterface,
  next: NextInterface
) => {
  event.key = randomKey(32);
  event.createTime = +new Date();
  next();
};
