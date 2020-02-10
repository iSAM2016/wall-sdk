var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var TryCatch = /** @class */ (function () {
    function TryCatch(wall) {
        var _this = this;
        this.formatError = function (errObj, errorInfo) {
            var col = errObj.column || errObj.columnNumber; // Safari Firefox
            var row = errObj.line || errObj.lineNumber; // Safari Firefox
            var message = errObj.message;
            var name = errObj.name;
            var stack = errObj.stack;
            if (stack) {
                var _a = _this.getStackInfo(stack), content = _a.content, resourceUrl = _a.resourceUrl, stackRow = _a.stackRow, stackCol = _a.stackCol;
                return __assign(__assign({}, errorInfo), {
                    errorMessage: message,
                    scriptURI: resourceUrl,
                    lineNumber: Number(row || stackRow),
                    columnNumber: Number(col || stackCol),
                    name: name,
                    content: content
                });
            }
            return __assign(__assign({}, errorInfo), {
                errorMessage: message,
                lineNumber: row,
                columnNumber: col,
                name: name
            });
        };
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
    TryCatch.prototype.createCustomEvent = function () {
        var _this = this;
        this.WALL.createCustomErrorEvent = function (message, content) {
            var sourceError = {
                message: '静态资源加载错误',
                content: content
            };
            var errorInfo = {
                type: 'ERROR_CUSTOM',
                info: sourceError
            };
            _this.WALL(errorInfo);
        };
    };
    TryCatch.prototype.changeRriginAddEventListener = function () {
        var originAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            var addStack = new Error("Event (" + type + ")").stack;
            var wrappedListener = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                try {
                    // 浏览器不会对 try-catch 起来的异常进行跨域拦截，所以 catch 到的时候，是有堆栈信息的；
                    return listener.apply(this, args);
                }
                catch (err) {
                    err.stack += '\n' + addStack;
                    // throw err;TODO:??
                }
            };
            return originAddEventListener.call(this, type, wrappedListener, options);
        };
    };
    //重写error
    TryCatch.prototype.onError = function () {
        var _this = this;
        var originHandleError = window.onerror;
        window.onerror = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var _a = __read(arg, 5), errorMessage = _a[0], scriptURI = _a[1], lineNumber = _a[2], columnNumber = _a[3], errorObj = _a[4];
            var normalError = {
                message: '异常',
                errorMessage: String(errorMessage),
                scriptURI: scriptURI,
                lineNumber: lineNumber,
                columnNumber: columnNumber
            };
            normalError = _this.formatError(errorObj, normalError);
            var errorInfo = {
                type: 'ERROR_RUNTIME',
                info: normalError
            };
            _this.WALL(errorInfo);
            // return true; 当返回true 异常才不会向上抛出
            originHandleError && originHandleError.apply(window, arg);
        };
    };
    TryCatch.prototype.getStackInfo = function (stack) {
        var _a;
        var matchUrl = stack.match(/https?:\/\/[^\n]+/);
        var urlFirstStack = matchUrl ? matchUrl[0] : '';
        var regUrlCheck = /https?:\/\/(\S)*\.js/;
        var resourceUrl = '';
        if (regUrlCheck.test(urlFirstStack)) {
            resourceUrl = urlFirstStack.match(regUrlCheck)[0];
        }
        var stackCol = null;
        var stackRow = null;
        var posStack = urlFirstStack.match(/:(\d+):(\d+)/);
        if (posStack && posStack.length >= 3) {
            _a = __read(posStack, 3), stackCol = _a[1], stackRow = _a[2];
        }
        return { content: stack, resourceUrl: resourceUrl, stackRow: stackRow, stackCol: stackCol };
    };
    // primose 异常
    TryCatch.prototype.originOnunhandledrejection = function () {
        var _this = this;
        var originOnunhandledrejection = window.onunhandledrejection;
        window.onunhandledrejection = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var e = arg[0];
            e.preventDefault();
            var promiseError = {
                message: 'primise 错误',
                content: e.reason
            };
            var errorInfo = {
                type: 'ERROR_PROMISE',
                info: promiseError
            };
            _this.WALL(errorInfo);
            originOnunhandledrejection &&
                originOnunhandledrejection.apply(window, arg);
        };
    };
    // 资源加载异常
    TryCatch.prototype.startAddentListener = function () {
        window.addEventListener('error', function (e) {
            var typeName = e.target.localName;
            var sourceUrl = '';
            var type;
            if (typeName === 'link') {
                sourceUrl = e.target.href;
                type = 'ERROR_LINK';
            }
            else if (typeName === 'script') {
                sourceUrl = e.target.src;
                type = 'ERROR_SCRIPT';
            }
            else if (typeName === 'img') {
                sourceUrl = e.target.src;
                type = 'ERROR_IMAGE';
            }
            var sourceError = {
                message: '静态资源加载错误',
                typeName: typeName,
                sourceUrl: sourceUrl
            };
            var errorInfo = {
                type: type,
                info: sourceError
            };
            this.WALL(errorInfo);
        }, true);
    };
    TryCatch.prototype.consoleError = function () {
        var consoleError = window.console.error;
        var self = this;
        window.console.error = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var errorInfo = {
                type: 'ERROR_CONSOLE',
                info: {
                    message: JSON.stringify(arg)
                }
            };
            self.WALL(errorInfo);
            consoleError && consoleError.apply(window, arg);
        };
    };
    return TryCatch;
}());
export default TryCatch;
//# sourceMappingURL=trycatch.js.map