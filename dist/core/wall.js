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
import { randomKey } from '../util';
var Application = function () {
    var _this = this;
    //   最常用的是向 wallEvent 添加东西
    var app = function (wallEvent) {
        wallEvent.options = app.options;
        var index = 0;
        var next = function (error) {
            var layer = app.routes[index++];
            if (layer) {
                if (error) {
                    //  如果有错误，需要走错误接口
                    if (layer.method === 'middle' &&
                        layer.handler.length === 3) {
                        return layer.handler(wallEvent, next, error);
                    }
                    else {
                        next(error);
                    }
                }
                else {
                    if (layer.method === 'middle') {
                        if (layer.pathname === '/') {
                            return layer.handler(wallEvent, next);
                        }
                        else {
                            next();
                        }
                    }
                }
            }
        };
        // 首次执行;
        next();
    };
    app.options = {
        project_id: 0,
        origin: '',
        isTest: false,
        frequency: 1
    };
    app.routes = [];
    // 中间件
    app.use = function (handler) {
        app.routes.push({
            method: 'middle',
            pathname: '/',
            handler: handler
        });
        return _this;
    };
    app.listen = function (instance) { };
    // 初始化参数
    app.init = function (options) {
        // 检测options
        if (!options.project_id) {
            throw new Error('缺少项目project_id');
        }
        if (!options.origin) {
            throw new Error('缺少参数origin');
        }
        if (!options.frequency) {
            throw new Error('缺少参数frequency');
        }
        //设置userid
        if (!options.userId) {
            var randomUserID = void 0;
            var localWallUserID = localStorage.getItem('WALLUSERID');
            var randomUuid = localStorage.getItem('WALLUUID'); // 设备id
            if (!localWallUserID) {
                randomUserID = 'wall_' + randomKey(32);
                localStorage.setItem('WALLUSERID', randomUserID);
            }
            else {
                randomUserID = localWallUserID;
            }
            if (!randomUuid) {
                randomUuid = 'wall_uuid' + randomKey(32);
                localStorage.setItem('WALLUUID', randomUuid);
            }
            options.userId = randomUserID;
            options.uuid = randomUuid;
        }
        var myOptions = __assign(__assign({}, app.options), options);
        window.WALL_OPTIONS = myOptions;
        app.options = myOptions;
    };
    return app;
};
export default Application;
//# sourceMappingURL=wall.js.map