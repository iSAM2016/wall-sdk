import { optionsInterface } from '@app/types/options';
import { errorInterface } from '@app/types/error';
import { init } from '..';

class TryCatch {
    constructor(init: Function) {
        this.onError();
        this.originOnunhandledrejection();
    }
    /**
     * 重写error
     */
    onError(): void {
        let originHandleError = window.onerror;
        window.onerror = (...arg) => {
            let [
                errorMessage,
                scriptURI,
                lineNumber,
                columnNumber,
                errorObj
            ] = arg;
            console.log(errorObj);
            let errorInfo: errorInterface = this._formatError(errorObj);
            errorInfo._errorMessage = errorMessage;
            errorInfo._scriptURI = scriptURI;
            errorInfo._lineNumber = lineNumber;
            errorInfo._columnNumber = columnNumber;
            errorInfo.type = 'onerror';

            console.log(errorInfo);
            originHandleError && originHandleError.apply(window, arg);
        };
    }
    _formatError = errObj => {
        let col: number = errObj.column || errObj.columnNumber; // Safari Firefox
        let row: number = errObj.line || errObj.lineNumber; // Safari Firefox
        let message: string = errObj.message;
        let name: string = errObj.name;
        let info: errorInterface = {};

        let { stack } = errObj;
        if (stack) {
            let matchUrl = stack.match(/https?:\/\/[^\n]+/);
            let urlFirstStack = matchUrl ? matchUrl[0] : '';
            let regUrlCheck = /https?:\/\/(\S)*\.js/;

            let resourceUrl = '';
            if (regUrlCheck.test(urlFirstStack)) {
                resourceUrl = urlFirstStack.match(regUrlCheck)[0];
            }

            let stackCol = null;
            let stackRow = null;
            let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
            if (posStack && posStack.length >= 3) {
                [, stackCol, stackRow] = posStack;
            }

            // TODO formatStack
            return (info = {
                content: stack,
                col: Number(col || stackCol),
                row: Number(row || stackRow),
                message,
                name,
                resourceUrl
            });
        }
        return (info = {
            row,
            col,
            message,
            name
        });
    };
    // primose 异常
    originOnunhandledrejection() {
        let originOnunhandledrejection = window.onunhandledrejection;
        window.onunhandledrejection = (...arg) => {
            let e = arg[0];
            let reason = e.reason;
            let info = { type: e.type || 'unhandledrejection', reason };
            console.log(info);
            originOnunhandledrejection &&
                originOnunhandledrejection.apply(window, arg);
        };
    }
}

export default TryCatch;
