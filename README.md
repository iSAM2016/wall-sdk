# wall-sdk

wall-sdk 是 wall 监听系统的前端 SDK，负责收集前端信息

## 主要性能

1.  采用 express 中间件， 可以快速处理 [event](#event)
2.  监听用户行为：用户点击，路由改变，用户请求， 资源加载
3.  [indexDB](https://github.com/xmoyking/localForage-cn) 存储，可以追寻用户行为路径，可以追踪到错误发生之前的用户行为
4.  适用 `vue` `react` 微信小程序
5.  监控: onerror 全局监听, addEventListener 全局监听,try...catch 主动捕获,重写 XMLHttpRequest 对象方法 普通错误，primose 异常， console.error, 图片加载错误， xhr 错误，fetch 错误
6.  可以上传自定义错误
7.  可以自定义用户行为
8.  对 ERROR 设置上报频率
9.  performance 页面性能数据
10. TS 搭建
11. img 图片上传日志

## npm 引用

```
npm install wall_sdk --save
```

```
import  Wall from 'wall_sdk'

Wall.init({
  token: xxxxxxxxxx, // 项目标识
  isTest: false,// 是否是测试数据，默认为false(测试模式下打点数据仅供控制台打印浏览, 不会上传到系统中)
  frequency: 1, // 上报频率（只针对错误和用户行为，页面性能相关，每天上报一次）

});

```

## vue 使用

## react 使用

## 快速开始

进入目录安装依赖:

```bash
npm i 或者 yarn install
```

开发：

```bash
npm run start
打开 http://localhost:8001
```

打包

```
npm run build:deploy
```

测试：

## event 说明

### <a id="event">event</a>

## TODO:

1. 崩溃和卡顿
2. sourceMap
3. webpack 插件
4. 测试
5. 用户访问应用次数记录统计(记录第一次加载， 记录刷新) session pv
6. 每个页面首次加载时间统计(记录第一次加载) uv

Vue 2.x 中我们应该这样捕获全局异常：

```
Vue.config.errorHandler = function (err, vm, info) {
    let {
        message, // 异常信息
        name, // 异常名称
        script,  // 异常脚本url
        line,  // 异常行号
        column,  // 异常列号
        stack  // 异常堆栈信息
    } = err;

    // vm为抛出异常的 Vue 实例
    // info为 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
```

2.React 16.x 版本中引入了 Error Boundary：

```
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });

        // 将异常信息上报给服务器
        logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            return '出错了';
        }

        return this.props.children;
    }
}
```

可以看到生命周期钩子里的错误是可以被 errorHandler 捕获到，但是当我们主动点击 div 触发 clickerror 时，会发现这时错误并没有被 errorHandler 捕获到，控制台输出的是 Uncaught Error，也就是没有被捕获到的错误，所以需要注意的是，errorHandler 方法目前还捕获不到绑定监听事件触发的异常，但是可以捕获到在生命周期钩子中调用的方法的错误。

解决方案 ：使用 window.onerror

window.onerror = function (message, source, lineno, colno, error) {
console.error('通过 onerror 捕获到的错误');
console.error(message);
console.error(source);
console.error(lineno);
console.error(colno);
console.error(error);
}
在 MVVM 框架中使用 onerror 监听全局异常会发现并不能捕获到绑定事件的详细错误信息，只会输出 Script Error，
