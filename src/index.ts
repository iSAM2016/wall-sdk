import { errorInterface, optionsInterface } from "@app/types";

import TryCatch from "./integrations/tryCatch";

export const defaultIntegrations = [
  // new TryCatch()
  //   new Breadcrumbs(),
  //   new GlobalHandlers(),
  //   // new LinkedErrors(),
  //   new UserAgent(),
  // ];
];

class WallCore {
  constructor(options: optionsInterface) {
    if (options.token === void 0) {
      throw Error("token is required");
    }
    this.init();
  }
  /**
   * 重写error
   */
  init() {
    new TryCatch();
  }
}
/**
 * init wal
 * @param options
 */
function init(options: optionsInterface) {
  console.log(options);
  if (!(window as any).WALL) {
    return new WallCore(options); // TODO: window 单例模式
  }
  return (window as any).WALL;
}

export { init };
