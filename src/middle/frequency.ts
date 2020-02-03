import { EventInterface, NextInterface } from "../types";

export const frequency = (event: EventInterface, next: NextInterface) => {
  if (event.type.includes("ERROR")) {
    event.isUpload = false;
    if (Math.random() < event.options.frequency) {
      event.isUpload = true;
    }
  }
  next();
};
