import { OptionsInterface } from "@app/types/options";
import { ErrorInterface } from "@app/types/error";
//https://gist.github.com/codecorsair/e14ec90cee91fa8f56054afaa0a39f13

export interface xhrInfoInterface {
  url: string;
  method?: Function;
  status?: number;
  event?: string;
  success?: boolean;
  duration?: number;
  responseSize?: string;
  requestSize?: number;
  type?: string;
}

class Xhr {
  private readonly xhr = window.XMLHttpRequest;
  private originOpen: Function = this.xhr.prototype.open;
  private originSend: Function = this.xhr.prototype.send;
  private eventListenerMethods: Array<String> = ["load", "error", "abort"];
  private _eagle_start_time: number;
  private xhrInfo: xhrInfoInterface = {
    url: "",
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
    let _self = this;
    _self.xhr.prototype.open = function(method, url) {
      _self.xhrInfo = {
        url,
        method,
        status: null
      };
      return _self.originOpen.apply(this, arguments);
    };
  }
  private xhrsend(): void {
    let _self = this;
    this.xhr.prototype.send = function(value: any) {
      let xhr = this;
      _self._eagle_start_time = Date.now();

      let ajaxEnd = event => () => {
        if (xhr.responseType) {
          let responseSize = null;
          switch (xhr.responseType) {
            case "json":
              responseSize = JSON && JSON.stringify(xhr.response).length;
              break;

            case "blob":
            case "moz-blob":
              responseSize = xhr.response.size;
            case "arraybufffer":
              responseSize = xhr.response.byteLength;
            case "document":
              responseSize =
                xhr.response.documentElement &&
                xhr.response.documentElement.innerHTML &&
                xhr.response.documentElement.innerHTML.length + 28;
              break;
            default:
              responseSize = xhr.response.length;
          }
          _self.xhrInfo.event = event;
          _self.xhrInfo.status = xhr.status;
          _self.xhrInfo.success =
            (xhr.status >= 200 && xhr.status <= 206) || xhr.status === 304;
          _self.xhrInfo.duration = Date.now() - _self._eagle_start_time;
          _self.xhrInfo.responseSize = responseSize;
          _self.xhrInfo.requestSize = value ? value.length : 0;
          _self.xhrInfo.type = "xhr";
        }
      };

      if (xhr.addEventListener) {
        this.eventListenerMethods.reduce((xhr: any, method: string) => {
          xhr.addEventListener(method, ajaxEnd(method), false);
          return xhr;
        }, this);
      } else {
        let _origin_onreadystatechange = xhr.onreadystatechange;
        xhr.onreadystatechange = function(event) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              ajaxEnd("end")();
              //实际操作
              //   result.innerHTML += xhr.responseText;
            }
          }
          //   if (_origin_onreadystatechange) {
          //     _originOpen.apply(this, arguments);
          //   }
          //   if (this.readyState === 4) {
          //     ajaxEnd('end')();
          //   }
        };

        // return _self.apply(this, arguments);
      }
    };
  }

  public request() {}
}

export default Xhr;
