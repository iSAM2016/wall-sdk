import { BaseInfoInterface, NextInterface } from "../types";

export const frequency = (event: BaseInfoInterface, next: NextInterface) => {
  if (event.type.includes("ERROR")) {
    event.isUpload = false;
    if (Math.random() < event.options.frequency) {
      event.isUpload = true;
    }
  }
  console.log(event);
  next();
};
