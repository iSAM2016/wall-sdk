import { optionsInterface } from '@app/types/options';
import { errorInterface } from '@app/types/error';
//https://gist.github.com/codecorsair/e14ec90cee91fa8f56054afaa0a39f13
export interface xhrInfoInterface {
    url: string;
    method?: Function;
    status: number;
}
class Xhr {
    private readonly xhr = window.XMLHttpRequest;
    private originOpen: Function = this.xhr.prototype.open;
    private originSend: Function = this.xhr.prototype.send;
    private _eagle_start_time: 0;
    private xhrInfo: xhrInfoInterface = {
        url: '',
        status: 0
    };
    constructor() {
        this.xhropen();
        this.xhrsend();
    }
    /**
     * 打开
     */
    private xhropen(): void {
        this.xhr.prototype.open = function(method, url) {
            this.xhrInfo = {
                url,
                method,
                status: null
            };
            return this.originOpen.apply(this, arguments);
        };
    }
    private xhrsend(value): void {
        this.xhr.prototype.send = function(value) {};
    }
    public request() {}
}

export default Xhr;
