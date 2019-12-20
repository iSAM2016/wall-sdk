/* 加载时间
 * @Author: isam2016
 * @Date: 2019-12-20 14:56:29
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 15:14:57
 */
import { onload, resolveEntries } from "../util";
import { AppInterface, BaseInfoInterface } from "@app/types";

const resources = (wall: AppInterface) => {
  let performance =
    window.performance ||
    (window as any).mozPerformance ||
    (window as any).msPerformance ||
    (window as any).webkitPerformance;
  if (!performance || !performance.getEntries) {
    return void 0;
  }

  if (window.PerformanceObserver) {
    let observer = new window.PerformanceObserver(list => {
      try {
        let entries = list.getEntries();
        let resourcesInfo: BaseInfoInterface = {
          type: "RESCOURCES",
          info: {
            message: resolveEntries(entries)
          }
        };

        wall(resourcesInfo);
      } catch (e) {
        console.error(e);
      }
    });

    observer.observe({
      entryTypes: ["resource"]
    });
  } else {
    onload(() => {
      let entries = performance.getEntriesByType("resource");
      let resourcesInfo: BaseInfoInterface = {
        type: "RESCOURCES",
        info: {
          message: resolveEntries(entries)
        }
      };

      wall(resourcesInfo);
    });
  }
};

export default resources;
