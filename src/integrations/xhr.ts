/*
 * xhr模块
 * @Author: isam2016
 * @Date: 2019-12-19 14:48:02
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 17:15:45
 * TODO: fetch
 */
import {
    XhrInfoInterface,
    EventInterface,
    AppInterface,
    EngineInterface
} from '@app/types';

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
    private xhrInfo: XhrInfoInterface;
    WALL: AppInterface;

    constructor(wall: AppInterface) {
        this.WALL = wall;
        this.xhropen();
        this.xhrsend();
    }
    /**
     * 打开
     */
    private xhropen(): void {
        let _self = this;
        _self.xhr.prototype.open = function(method, url) {
            _self.xhrInfo = {
                type: 'BEHAVIORXHR',
                url,
                method,
                status: null,
                info: {
                    message: ''
                }
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
            this.xhrInfo.requestDate = this.WALL.options.paramEncryption(
                this.param
            );

            if (!this.xhrInfo.success) {
                this.xhrInfo.type = 'XHRERROR';
            }
            this.WALL(this.xhrInfo);
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

    public request() {}
}

export default Xhr;
