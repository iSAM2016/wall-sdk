/* 页面加载信息监控
//TODO: 当页面变化的时候需要 加载页面信息
 * @Author: isam2016
 * @Date: 2019-12-20 14:56:29
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 15:14:57
 */
import {
    AppInterface,
    EventInterface,
    loadPageInterface,
    loadType
} from '@app/types';

class Resources {
    WALL: AppInterface;
    constructor(wall: AppInterface) {
        this.WALL = wall;
    }
    /**
     * 获取performance
     */
    private getPerformanceEntries(): PerformanceEntryList {
        let performance: Performance =
            window.performance ||
            (window as any).mozPerformance ||
            (window as any).msPerformance ||
            (window as any).webkitPerformance;
        if (performance && typeof performance.getEntries === 'function') {
            return performance.getEntries();
        }
        return null;
    }
    /**
     * 获取页面加载属性-资源时间轴
     */
    private getPerformanceTiming(): PerformanceTiming {
        if (performance && performance.timing) {
            return performance.timing;
        }
        return null;
    }
    // 判断页面是第一次加载还是刷新
    // true 第一次加载 false 第二次加载
    private reloadPageType(): loadType {
        let performanceEntryList: PerformanceEntryList = this.getPerformanceEntries();
        if (performanceEntryList) {
            if (
                performanceEntryList[0] &&
                (performanceEntryList[0] as any).type === 'navigate'
            ) {
                return 'navigate';
            } else {
                return 'reload';
            }
        }
    }
    // 获取时间轴
    private getTimingObj() {
        let performanceTiming: PerformanceTiming = this.getPerformanceTiming();
        let loadPageInfo: loadPageInterface = {
            message: '页面加载时间',
            // 页面加载类型， 区分第一次load还是reload
            loadType: this.reloadPageType(),
            //【重要】页面加载完成的时间
            //【原因】这几乎代表了用户等待页面可用的时间
            loadPageTime:
                performanceTiming.loadEventEnd -
                performanceTiming.navigationStart,
            //【重要】解析 DOM 树结构的时间
            //【原因】反省下你的 DOM 树嵌套是不是太多了！
            domReady:
                performanceTiming.domComplete - performanceTiming.responseEnd,
            //【重要】重定向的时间
            //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
            redirect:
                performanceTiming.redirectEnd - performanceTiming.redirectStart,
            //【重要】DNS 查询时间
            //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
            // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfaulperformanceTiming.com/a/1190000000633364)
            lookupDomain:
                performanceTiming.domainLookupEnd -
                performanceTiming.domainLookupStart,
            //【重要】读取页面第一个字节的时间
            //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
            // TTFB 即 Time To First Byte 的意思
            // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
            ttfb:
                performanceTiming.responseStart -
                performanceTiming.navigationStart,
            //【重要】内容加载完成的时间
            //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
            request:
                performanceTiming.responseEnd - performanceTiming.requestStart,
            //【重要】执行 onload 回调函数的时间
            //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
            loadEvent:
                performanceTiming.loadEventEnd -
                performanceTiming.loadEventStart,
            // DNS 缓存时间
            appcache:
                performanceTiming.domainLookupStart -
                performanceTiming.fetchStart,
            // 卸载页面的时间
            unloadEvent:
                performanceTiming.unloadEventEnd -
                performanceTiming.unloadEventStart,
            // TCP 建立连接完成握手的时间
            connect:
                performanceTiming.connectEnd - performanceTiming.connectStart
        };

        let resourcesInfo: EventInterface = {
            type: 'RESCOURCES',
            info: loadPageInfo
        };
        this.WALL(resourcesInfo);
    }
}

export default Resources;

// const resources = (wall: AppInterface) => {
//     if (window.PerformanceObserver) {
//         let observer = new window.PerformanceObserver(list => {
//             try {
//                 let entries = list.getEntries();
//                 let resourcesInfo: EventInterface = {
//                     type: 'RESCOURCES',
//                     info: {
//                         message: resolveEntries(entries)
//                     }
//                 };
//                 wall(resourcesInfo);
//             } catch (e) {
//                 console.error(e);
//             }
//         });

//         observer.observe({
//             entryTypes: ['resource']
//         });
//     } else {
//         onload(() => {
//             let entries = performance.getEntriesByType('resource');
//             let resourcesInfo: EventInterface = {
//                 type: 'RESCOURCES',
//                 info: {
//                     message: resolveEntries(entries)
//                 }
//             };

//             wall(resourcesInfo);
//         });
//     }
// };
