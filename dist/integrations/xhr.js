/*
 * xhr模块
 * @Author: isam2016
 * @Date: 2019-12-19 14:48:02
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 17:15:45
 */
import { BehaviorCode } from '../types';
var Xhr = /** @class */ (function () {
    function Xhr(wall) {
        var _this = this;
        this.xhr = window.XMLHttpRequest;
        this.originOpen = this.xhr.prototype.open;
        this.originSend = this.xhr.prototype.send;
        this.eventListenerMethods = [
            'load',
            'error',
            'abort',
            'timeout'
        ];
        this.xhrInfo = {
            message: '',
            code: BehaviorCode['BEHAVIOR_XHR']
        };
        this.handleEvent = function (self) { return function (event) {
            var responseSize = null;
            if (event.responseType) {
                switch (event.responseType) {
                    case 'json':
                        responseSize =
                            JSON && JSON.stringify(event.response).length;
                        break;
                    case 'blob':
                    case 'moz-blob':
                        responseSize = event.response.size;
                    case 'arraybufffer':
                        responseSize = event.response.byteLength;
                    case 'document':
                        responseSize = _this.getDocumentElement(event);
                        break;
                    default:
                        responseSize = event.response.length;
                }
            }
            self.senInfo(event, responseSize);
        }; };
        this.WALL = wall;
        this.xhropen();
        this.xhrsend();
        this.fetch();
    }
    /**
     * 打开
     */
    Xhr.prototype.xhropen = function () {
        var _self = this;
        _self.xhr.prototype.open = function (method, url) {
            _self.xhrInfo = {
                message: '异步请求',
                url: url,
                method: method,
                status: null,
                code: BehaviorCode['BEHAVIOR_XHR']
            };
            return _self.originOpen.apply(this, arguments);
        };
    };
    Xhr.prototype.xhrsend = function () {
        var _self = this;
        this.xhr.prototype.send = function (value) {
            var me = this;
            _self.param = value;
            _self._eagle_start_time = Date.now();
            if (me.addEventListener) {
                _self.eventListenerMethods.reduce(function (me, method) {
                    me.addEventListener(method, _self.handleEvent(_self), false);
                    return me;
                }, me);
            }
            else {
                var _origin_onreadystatechange_1 = me.onreadystatechange;
                me.onreadystatechange = function (event) {
                    if (me.readyState == 4) {
                        if (me.status == 200) {
                            //TODO: 调用有误
                            _self.handleEvent(event);
                        }
                    }
                    _origin_onreadystatechange_1 &&
                        _origin_onreadystatechange_1.apply(this, arguments);
                };
            }
            return _self.originSend.apply(this, arguments);
        };
    };
    Xhr.prototype.senInfo = function (event, responseSize) {
        if (event.currentTarget) {
            var currentTarget = event.currentTarget;
            this.xhrInfo.responseSize = responseSize;
            this.xhrInfo.status = currentTarget.status;
            this.xhrInfo.statusText = currentTarget.statusText;
            this.xhrInfo.success = this.isXhrSuccess(currentTarget);
            this.xhrInfo.duration = Date.now() - this._eagle_start_time;
            this.xhrInfo.requestDate = this.param;
            var xhrAllInfo = {
                type: 'BEHAVIOR_XHR',
                info: this.xhrInfo
            };
            if (!this.xhrInfo.success) {
                xhrAllInfo.type = 'ERROR_XHR';
            }
            this.WALL(xhrAllInfo);
        }
    };
    Xhr.prototype.getDocumentElement = function (event) {
        return (event.response.documentElement &&
            event.response.documentElement.innerHTML &&
            event.response.documentElement.innerHTML.length + 28);
    };
    Xhr.prototype.isXhrSuccess = function (currentTarget) {
        return ((currentTarget.status >= 200 && currentTarget.status <= 206) ||
            currentTarget.status === 304);
    };
    // 重写fetch;
    Xhr.prototype.fetch = function () {
        var self = this;
        if (!window.fetch)
            return;
        var _origin_fetch = window.fetch;
        window.fetch = function () {
            var startTime = Date.now();
            var args = [].slice.call(arguments);
            var fetchInput = args[0];
            var method = 'GET';
            var url;
            if (typeof fetchInput === 'string') {
                url = fetchInput;
            }
            else if ('Request' in window &&
                fetchInput instanceof window.Request) {
                url = fetchInput.url;
                if (fetchInput.method) {
                    method = fetchInput.method;
                }
            }
            else {
                url = '' + fetchInput;
            }
            if (args[1] && args[1].method) {
                method = args[1].method;
            }
            return _origin_fetch.apply(this, args).then(function (response) {
                var fetchAllInfo = {
                    type: 'BEHAVIOR_FETCH',
                    info: {
                        message: 'fetch 请求',
                        status: response.status,
                        duration: Date.now() - startTime,
                        url: url,
                        method: method,
                        code: BehaviorCode['BEHAVIOR_FETCH']
                    }
                };
                self.WALL(fetchAllInfo);
            });
        };
    };
    return Xhr;
}());
export default Xhr;
//# sourceMappingURL=xhr.js.map