/*
 * xhr模块
 * @Author: isam2016
 * @Date: 2019-12-19 14:48:02
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 17:15:45
 */
import {
    XhrInterface,
    XhrInfoInterface,
    AppInterface,
    EngineInterface,
    FetchInterface,
    BehaviorCode
} from '../types';

class Xhr implements EngineInterface {
    private readonly xhr = window.XMLHttpRequest;
    private originOpen = this.xhr.prototype.open;
    private originSend: Function = this.xhr.prototype.send;
    private eventListenerMethods: Array<String> = [
        'load',
        'error',
        'abort',
        'timeout'
    ];
    private _eagle_start_time: number;
    private param: object;
    private xhrInfo: XhrInfoInterface = {
        message: '',
        code: BehaviorCode['BEHAVIOR_XHR']
    };
    WALL: AppInterface;

    constructor(wall: AppInterface) {
        this.WALL = wall;
        this.xhropen();
        this.xhrsend();
        this.fetch();
    }
    /**
     * 打开
     */
    private xhropen(): void {
        let _self = this;
        _self.xhr.prototype.open = function(method, url) {
            _self.xhrInfo = {
                message: '异步请求',
                url,
                method,
                status: null,
                code: BehaviorCode['BEHAVIOR_XHR']
            };
            return _self.originOpen.apply(this, arguments);
        };
    }
    private xhrsend(): void {
        let _self = this;
        this.xhr.prototype.send = function(value: any) {
            let me = this;
            _self.param = value;
            _self._eagle_start_time = Date.now();
            if (me.addEventListener) {
                _self.eventListenerMethods.reduce((me: any, method: string) => {
                    me.addEventListener(
                        method,
                        _self.handleEvent(_self),
                        false
                    );
                    return me;
                }, me);
            } else {
                let _origin_onreadystatechange = me.onreadystatechange;
                me.onreadystatechange = function(event) {
                    if (me.readyState == 4) {
                        if (me.status == 200) {
                            //TODO: 调用有误
                            _self.handleEvent(event);
                        }
                    }
                    _origin_onreadystatechange &&
                        _origin_onreadystatechange.apply(this, arguments);
                };
            }
            return _self.originSend.apply(this, arguments);
        };
    }
    private handleEvent = self => event => {
        let responseSize = null;
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
                    responseSize = this.getDocumentElement(event);
                    break;
                default:
                    responseSize = event.response.length;
            }
        }
        self.senInfo(event, responseSize);
    };
    private senInfo(event, responseSize) {
        if (event.currentTarget) {
            let currentTarget = event.currentTarget;
            this.xhrInfo.responseSize = responseSize;
            this.xhrInfo.status = currentTarget.status;
            this.xhrInfo.statusText = currentTarget.statusText;
            this.xhrInfo.success = this.isXhrSuccess(currentTarget);
            this.xhrInfo.duration = Date.now() - this._eagle_start_time;
            this.xhrInfo.requestDate = this.param;

            let xhrAllInfo: XhrInterface = {
                type: 'BEHAVIOR_XHR',
                info: this.xhrInfo
            };

            if (!this.xhrInfo.success) {
                xhrAllInfo.type = 'ERROR_XHR';
            }
            this.WALL(xhrAllInfo);
        }
    }
    private getDocumentElement(event) {
        return (
            event.response.documentElement &&
            event.response.documentElement.innerHTML &&
            event.response.documentElement.innerHTML.length + 28
        );
    }
    private isXhrSuccess(currentTarget) {
        return (
            (currentTarget.status >= 200 && currentTarget.status <= 206) ||
            currentTarget.status === 304
        );
    }
    // 重写fetch;
    private fetch() {
        let self = this;
        if (!window.fetch) return;
        let _origin_fetch = window.fetch;
        window.fetch = function() {
            let startTime = Date.now();
            let args = [].slice.call(arguments);
            let fetchInput = args[0];
            let method = 'GET';
            let url;

            if (typeof fetchInput === 'string') {
                url = fetchInput;
            } else if (
                'Request' in window &&
                fetchInput instanceof window.Request
            ) {
                url = fetchInput.url;
                if (fetchInput.method) {
                    method = fetchInput.method;
                }
            } else {
                url = '' + fetchInput;
            }

            if (args[1] && args[1].method) {
                method = args[1].method;
            }

            return _origin_fetch.apply(this, args).then(function(response) {
                let fetchAllInfo: FetchInterface = {
                    type: 'BEHAVIOR_FETCH',
                    info: {
                        message: 'fetch 请求',
                        status: response.status,
                        duration: Date.now() - startTime,
                        url,
                        method,
                        code: BehaviorCode['BEHAVIOR_FETCH']
                    }
                };
                self.WALL(fetchAllInfo);
            });
        };
    }
}

export default Xhr;
