/* 页面加载信息监控
 * @Author: isam2016
 * @Date: 2019-12-20 14:56:29
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-02-10 11:01:22
 */
import { BehaviorCode } from '../types';
import { debugLogger } from '../util';
var Resources = /** @class */ (function () {
    //   private defaultLocation = sessionStorage;
    function Resources(wall) {
        this.WALL = wall;
        this.listenerUrl();
    }
    /**
     * 获取performance
     */
    Resources.prototype.getPerformanceEntries = function () {
        var performance = window.performance ||
            window.mozPerformance ||
            window.msPerformance ||
            window.webkitPerformance;
        if (!performance) {
            // 当前浏览器不支持
            debugLogger('你的浏览器不支持 performance 接口');
            return null;
        }
        if (performance && typeof performance.getEntries === 'function') {
            return performance.getEntries();
        }
        return null;
    };
    /**
     * 获取页面加载属性-资源时间轴
     */
    Resources.prototype.getPerformanceTiming = function () {
        if (performance && performance.timing) {
            return performance.timing;
        }
        return null;
    };
    // 判断页面是第一次加载还是刷新
    // true 第一次加载 false 第二次加载
    Resources.prototype.reloadPageType = function () {
        var performanceEntryList = this.getPerformanceEntries();
        if (performanceEntryList) {
            if (performanceEntryList[0] &&
                performanceEntryList[0].type === 'navigate') {
                return 'navigate';
            }
            else {
                return 'reload';
            }
        }
    };
    // 获取时间轴
    Resources.prototype.getTimingObj = function () {
        var performanceTiming = this.getPerformanceTiming();
        var loadPageInfo = {
            message: '页面加载时间',
            // 页面加载类型， 区分第一次load还是reload
            loadType: this.reloadPageType(),
            //【重要】页面加载完成的时间
            //【原因】这几乎代表了用户等待页面可用的时间
            loadPageTime: performanceTiming.loadEventEnd -
                performanceTiming.navigationStart || 0,
            //【重要】解析 DOM 树结构的时间
            //【原因】反省下你的 DOM 树嵌套是不是太多了！
            domReady: performanceTiming.domComplete - performanceTiming.responseEnd ||
                0,
            //【重要】重定向的时间
            //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
            redirect: performanceTiming.redirectEnd -
                performanceTiming.redirectStart || 0,
            //【重要】DNS 查询时间
            //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
            // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfaulperformanceTiming.com/a/1190000000633364)
            lookupDomain: performanceTiming.domainLookupEnd -
                performanceTiming.domainLookupStart || 0,
            //【重要】读取页面第一个字节的时间
            //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
            // TTFB 即 Time To First Byte 的意思
            // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
            ttfb: performanceTiming.responseStart -
                performanceTiming.navigationStart || 0,
            //【重要】内容加载完成的时间
            //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
            request: performanceTiming.responseEnd -
                performanceTiming.requestStart || 0,
            //【重要】执行 onload 回调函数的时间
            //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
            loadEvent: performanceTiming.loadEventEnd -
                performanceTiming.loadEventStart || 0,
            // DNS 缓存时间
            appcache: performanceTiming.domainLookupStart -
                performanceTiming.fetchStart || 0,
            // 卸载页面的时间
            unloadEvent: performanceTiming.unloadEventEnd -
                performanceTiming.unloadEventStart || 0,
            // TCP 建立连接完成握手的时间
            connect: performanceTiming.connectEnd - performanceTiming.connectStart ||
                0
        };
        var resourcesInfo = {
            type: 'RESCOURCES',
            info: loadPageInfo
        };
        this.WALL(resourcesInfo);
    };
    // 监听url 变化
    Resources.prototype.listenerUrl = function () {
        var self = this;
        setInterval(function () {
            // 如果是单页应用， 只更改url
            var webLocation = window.location.href
                .split('?')[0]
                .replace('#', '');
            var defaultLocation = sessionStorage.getItem('defaultLocation');
            // 如果url变化了， 就把更新的url记录为 defaultLocation, 重新设置pageKey
            if (defaultLocation != webLocation) {
                sessionStorage.setItem('defaultLocation', webLocation);
                var URLInfo = {
                    message: '用户页面跳转',
                    oldURL: defaultLocation,
                    newURL: webLocation,
                    code: BehaviorCode['BEHAVIOR_URLCHANGE']
                };
                var behaviorInfo = {
                    type: 'BEHAVIOR_URLCHANGE',
                    info: URLInfo
                };
                self.WALL(behaviorInfo);
                self.getTimingObj();
            }
        }, 200);
    };
    return Resources;
}());
export default Resources;
//# sourceMappingURL=resources.js.map