/*
 * 错误监听
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-20 17:48:48
 */
import {
  EventInterface,
  EngineInterface,
  AppInterface,
  SourceErrorInterface,
  CustomErrorInterface,
  PromiseErrorInterface
} from "@app/types";

class TryCatch implements EngineInterface {
  WALL: AppInterface;
  constructor(wall: AppInterface) {
    this.WALL = wall;
    this.createCustomEvent();
    this.changeRriginAddEventListener();
    this.onError();
    this.originOnunhandledrejection();
    this.startAddentListener();
    this.consoleError();
  }
  /**
   * 自定义错误
   */
  private createCustomEvent(): void {
    this.WALL.createCustomErrorEvent = (message: string, content: Object) => {
      let sourceError: CustomErrorInterface = {
        message: "静态资源加载错误",
        content
      };
      let errorInfo: EventInterface = {
        type: "CUSTOMERROR",
        info: sourceError
      };
      this.WALL(errorInfo);
    };
  }
  private changeRriginAddEventListener() {
    const originAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const addStack = new Error(`Event (${type})`).stack;
      const wrappedListener = function(...args) {
        try {
          // 浏览器不会对 try-catch 起来的异常进行跨域拦截，所以 catch 到的时候，是有堆栈信息的；
          return (listener as any).apply(this, args);
        } catch (err) {
          err.stack += "\n" + addStack;
          throw err;
        }
      };
      return originAddEventListener.call(this, type, wrappedListener, options);
    };
  }
  //重写error //TODO:
  private onError(): void {
    let originHandleError = window.onerror;
    window.onerror = (...arg) => {
      let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
      // let errorInfo: EventInterface = {
      //     type: 'NORMALERROR'
      //     // info: {}
      // };
      // errorInfo.info._errorMessage = errorMessage;
      // errorInfo.info._scriptURI = scriptURI;
      // errorInfo.info._lineNumber = lineNumber;
      // errorInfo.info._columnNumber = columnNumber;
      // errorInfo = this.formatError(errorObj, errorInfo);
      // this.WALL(errorInfo);
      // return true; 当返回true 异常才不会向上抛出
      originHandleError && originHandleError.apply(window, arg);
    };
  }
  private formatError = (errObj, errorInfo) => {
    let col: number = errObj.column || errObj.columnNumber; // Safari Firefox
    let row: number = errObj.line || errObj.lineNumber; // Safari Firefox
    let message: string = errObj.message;
    let name: string = errObj.name;

    let { stack } = errObj;
    if (stack) {
      let { content, resourceUrl, stackRow, stackCol } = this.getStackInfo(
        stack
      );
      return {
        ...errorInfo,
        ...{
          info: {
            row: Number(row || stackRow),
            col: Number(col || stackCol),
            name,
            message,
            content,
            resourceUrl
          }
        }
      };
    }
    return {
      ...errorInfo,
      ...{
        info: {
          row,
          col,
          name,
          message
        }
      }
    };
  };
  private getStackInfo(stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/);
    let urlFirstStack = matchUrl ? matchUrl[0] : "";
    let regUrlCheck = /https?:\/\/(\S)*\.js/;

    let resourceUrl = "";
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];
    }

    let stackCol = null;
    let stackRow = null;
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack;
    }

    return { content: stack, resourceUrl, stackRow, stackCol };
  }
  // primose 异常 //TODO: 需要stak
  private originOnunhandledrejection() {
    let originOnunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = (...arg) => {
      let e = arg[0];
      const error = e && e.reason;
      const message = error.message || "";
      const stack = error.stack || "";

      e.preventDefault();

      let promiseError: PromiseErrorInterface = {
        message: "primise 错误",
        content: e.reason
      };
      let errorInfo: EventInterface = {
        type: "PROMISEERROR",
        info: promiseError
      };
      this.WALL(errorInfo);
      originOnunhandledrejection &&
        originOnunhandledrejection.apply(window, arg);
    };
  }
  // 资源加载异常
  private startAddentListener() {
    window.addEventListener(
      "error",
      function(e) {
        let typeName: string = (e.target as any).localName;
        let sourceUrl: string = "";
        if (typeName === "link") {
          sourceUrl = (e.target as any).href;
        } else if (typeName === "script") {
          sourceUrl = (e.target as any).src;
        } else if (typeName === "img") {
          sourceUrl = (e.target as any).src;
          let sourceError: SourceErrorInterface = {
            message: "静态资源加载错误",
            typeName,
            sourceUrl
          };
          let errorInfo: EventInterface = {
            type: "SOURCEERROR",
            info: sourceError
          };
          this.WALL(errorInfo);
        }
      },
      true
    );
  }

  private consoleError() {
    let consoleError = window.console.error;
    let self = this;
    window.console.error = function(...arg) {
      let errorInfo: EventInterface = {
        type: "CONSOLEERRR",
        info: {
          message: JSON.stringify(arg)
        }
      };
      self.WALL(errorInfo);
      consoleError && consoleError.apply(window, arg);
    };
  }
}

export default TryCatch;
