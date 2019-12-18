import { ErrorInterface, EngineInterface } from "@app/types";

/**
 * error 重写
 */
class TryCatch implements EngineInterface {
  WALL: Function;
  // 注册发动机 TODO: wall
  constructor(wall: Function) {
    this.WALL = wall;
    this.onError();
    this.originOnunhandledrejection();
    this.startAddentListener();
  }
  createEvent() {}
  /**
   * 重写error
   */
  onError(): void {
    let originHandleError = window.onerror;
    window.onerror = (...arg) => {
      let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
      let errorInfo: ErrorInterface = {
        type: "NORMALERROR",
        createTime: +new Date(),
        info: {}
      };
      errorInfo.info._errorMessage = errorMessage;
      errorInfo.info._scriptURI = scriptURI;
      errorInfo.info._lineNumber = lineNumber;
      errorInfo.info._columnNumber = columnNumber;
      errorInfo = this._formatError(errorObj, errorInfo);

      this.WALL(errorInfo);
      // originHandleError && originHandleError.apply(window, arg);
    };
  }
  _formatError = (errObj, errorInfo) => {
    let col: number = errObj.column || errObj.columnNumber; // Safari Firefox
    let row: number = errObj.line || errObj.lineNumber; // Safari Firefox
    let message: string = errObj.message;
    let name: string = errObj.name;

    let { stack } = errObj;
    if (stack) {
      let { content, resourceUrl, stackRow, stackCol } = this._getStackInfo(
        stack
      );
      // TODO formatStack
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
  _getStackInfo(stack) {
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

  // primose 异常
  originOnunhandledrejection() {
    let originOnunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = (...arg) => {
      let e = arg[0];
      let reason = e.reason;
      let errorInfo: ErrorInterface = {
        type: "NORMALERROR",
        createTime: +new Date(),
        info: {
          message: reason
        }
      };
      this.WALL(errorInfo);
      originOnunhandledrejection &&
        originOnunhandledrejection.apply(window, arg);
    };
  }

  // 资源加载异常
  startAddentListener() {
    // this._deepTraversal(document.head);
    this._deepTraversal(document.body);
  }

  _deepTraversal(node) {
    if (!node) {
      console.log("请把脚本放在html");
    }
    let children = [].slice.call(node.childNodes).filter(_ => _.nodeType === 1);
    let imgScript = children.filter(_ => {
      if (_.tagName) {
        let tagName = _.tagName.toLocaleLowerCase();
        return tagName === "img" || tagName === "script";
      }
    });
    this._bindErrorListenter(imgScript);
    let subChildren = children.filter(_ => {
      if (_.tagName) {
        let tagName = _.tagName.toLocaleLowerCase();
        return tagName !== "img" && tagName !== "script";
      }
    });
    console.log(imgScript);
    for (let i = 0; i < subChildren.length; i++) {
      this._deepTraversal(subChildren[i]);
    }
  }
  _bindErrorListenter(nodeTages) {
    nodeTages.forEach(_ => {
      _.onerror = function(error) {
        console.log(error);
      };
    });
  }
}

export default TryCatch;
