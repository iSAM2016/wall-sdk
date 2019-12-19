/*
 * 错误监听
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-19 15:22:10
 */
import { BaseInfoInterface, EngineInterface } from '@app/types';

class TryCatch implements EngineInterface {
    WALL: Function;
    // 注册发动机 TODO: wall 的interface
    constructor(wall: Function) {
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
    private createCustomEvent() {
        let self = this;
        (self.WALL as any).createCustomEvent = message => {
            let errorInfo: BaseInfoInterface = {
                type: 'CUSTOMERROR',
                info: {
                    message
                }
            };
            self.WALL(errorInfo);
        };
    }
    private changeRriginAddEventListener() {
        const originAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(
            type,
            listener,
            options
        ) {
            const addStack = new Error(`Event (${type})`).stack;
            const wrappedListener = function(...args) {
                try {
                    // 浏览器不会对 try-catch 起来的异常进行跨域拦截，所以 catch 到的时候，是有堆栈信息的；
                    return (listener as any).apply(this, args);
                } catch (err) {
                    err.stack += '\n' + addStack;
                    throw err;
                }
            };
            return originAddEventListener.call(
                this,
                type,
                wrappedListener,
                options
            );
        };
    }
    //重写error
    private onError(): void {
        let originHandleError = window.onerror;
        window.onerror = (...arg) => {
            let [
                errorMessage,
                scriptURI,
                lineNumber,
                columnNumber,
                errorObj
            ] = arg;
            let errorInfo: BaseInfoInterface = {
                type: 'NORMALERROR',
                info: {}
            };
            errorInfo.info._errorMessage = errorMessage;
            errorInfo.info._scriptURI = scriptURI;
            errorInfo.info._lineNumber = lineNumber;
            errorInfo.info._columnNumber = columnNumber;
            errorInfo = this.formatError(errorObj, errorInfo);
            this.WALL(errorInfo);
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
            let {
                content,
                resourceUrl,
                stackRow,
                stackCol
            } = this.getStackInfo(stack);
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
    private getStackInfo(stack) {
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

        return { content: stack, resourceUrl, stackRow, stackCol };
    }
    // primose 异常
    private originOnunhandledrejection() {
        let originOnunhandledrejection = window.onunhandledrejection;
        window.onunhandledrejection = (...arg) => {
            let e = arg[0];
            e.preventDefault();
            let reason = e.reason;
            let errorInfo: BaseInfoInterface = {
                type: 'NORMALERROR',
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
    private startAddentListener() {
        this.deepTraversal(document.head || {});
        this.deepTraversal(document.body || {});
    }
    private deepTraversal(node) {
        if (!node.childNodes) {
            return false;
        }
        let children = [].slice
            .call(node.childNodes)
            .filter(_ => _.nodeType === 1);
        let imgScript = children.filter(_ => {
            if (_.tagName) {
                let tagName = _.tagName.toLocaleLowerCase();
                return tagName === 'img';
            }
        });
        this._bindErrorListenter(imgScript);
        let subChildren = children.filter(_ => {
            if (_.tagName) {
                let tagName = _.tagName.toLocaleLowerCase();
                return (
                    tagName !== 'img' &&
                    tagName !== 'script' &&
                    tagName !== 'link' &&
                    tagName !== 'iframe'
                );
            }
        });
        for (let i = 0; i < subChildren.length; i++) {
            this.deepTraversal(subChildren[i]);
        }
    }
    private _bindErrorListenter(nodeTages) {
        let self = this;
        nodeTages.forEach(_ => {
            _.onerror = function(error) {
                let errorInfo: BaseInfoInterface = {
                    type: 'IMAGEERROR',
                    info: {
                        message: '图片加载错误',
                        tartget: {
                            alt: error.target.alt,
                            src: error.target.src,
                            path: error.path
                                .filter(_ => _.tagName)
                                .map(_ => _.tagName.toLocaleLowerCase())
                        }
                    }
                };
                self.WALL(errorInfo);
                return true;
            };
        });
    }
    private consoleError() {
        let consoleError = window.console.error;
        let self = this;
        window.console.error = function(...arg) {
            let errorInfo: BaseInfoInterface = {
                type: 'CONSOLEERRR',
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
