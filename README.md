# wall_sdk

## 简介

wall_sdk 是一款前端监听系统(SDK)，负责收集前端信息，包括 ajax, fetch ,error，用户行为等。监控服务还包括 wall 监控系统的服务端[wall-server](https://github.com/iSAM2016/wall-server)

项目整体的部署流程请参考-[部署](https://github.com/iSAM2016/wall-server#%E9%83%A8%E7%BD%B2)

## 主要性能

1.  采用 express 中间件， 可以快速处理 [event](#event)
2.  监听用户行为：用户点击，路由改变，用户请求， 资源加载，具体类型为[eventType](#type)
3.  监控: onerror 全局监听, addEventListener 全局监听,try...catch 主动捕获,重写 XMLHttpRequest 对象方法 普通错误，primose 异常， console.error, 图片加载错误， xhr 错误，fetch 错误
4.  适用 `vue` `react`
5.  可以上传自定义错误
6.  可以自定义用户行为
7.  uuid 统计 uv
8.  ucid(useid) 统计用户
9.  对 ERROR 设置上报频率
10. performance 页面性能数据
11. TS 搭建
12. img 图片上传日志

## npm 引用

> 引入 sdk 放到所有 js 资源之前

```
npm install wall_sdk --save
```

```
import  Wall from 'wall_sdk'

Wall.init({
  project_id: xxxxxxxxxx, // 项目标识
  isTest: false,
  frequency: 1,
});
```

具体 init 初始化参考 [options](#options)

### vue 中使用（自定义错误）

Vue 2.x 中我们应该这样捕获全局异常：

```js
Vue.config.errorHandler = function(err, vm, info) {
    let {
        message, // 异常信息
        name, // 异常名称
        script, // 异常脚本url
        line, // 异常行号
        column, // 异常列号
        stack // 异常堆栈信息
    } = err;

    WALL.createCustomErrorEvent({
        message: 'vue异常',
        content: {
            message,
            name,
            script,
            line,
            column,
            stack
        }
    });

    // vm为抛出异常的 Vue 实例
    // info为 Vue 特定的错误信息，比如错误所在的生命周期钩子
};
```

## react

React 16.x 版本中引入了 Error Boundary：

```js
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // 将异常信息上报给服务器
        WALL.createCustomErrorEvent({
            message: 'react异常',
            content: info
        });
    }

    render() {
        if (this.state.hasError) {
            return '出错了';
        }

        return this.props.children;
    }
}
```

## 开发

进入目录安装依赖:

```bash
npm i 或者 yarn install
```

开发& 测试：

```bash
npm run start
打开 http://localhost:8001
index.html 中包含各种类型错误，可以调试
```

打包

```
npm run build
```

## <a id="event">event</a>

event 含义： 错误的发生，用户的行为， 资源的加载，统称为 `事件`，即为 event，event 中包含事件的详细信息。

可以参考 [event-demo](#eventdomo)

```js
interface EventInterface {
    type: keyof EventType   // event.type
    info: InfoInterface;    // 上报的具体信息内容
    key?: string;           // 每个event 都有自己的 唯一key
    version?: number;       // sdk 版本
    createTime?: number;    // event创建时间
    options?: OptionsInterface; // wall 初始化信息
    userId?: string;        // 用户id
    uuid?: string;          // 设备id
}
```

## <a id="type">event.type</a>

event 的类型-type 如下, 每个类型都会触发信息上报

```js
type EventType = {
    ERROR_XHR: 'ERROR_XHR', // xhrerror
    ERROR_LINK: 'ERROR_LINK', //静态资源 link加载错误
    ERROR_IMAGE: 'ERROR_IMAGE', //静态资源 img
    ERROR_SCRIPT: 'ERROR_SCRIPT', // 静态资源 script加载错误
    ERROR_CUSTOM: 'ERROR_CUSTOM', // 用户自定义错误
    ERROR_RUNTIME: 'ERROR_RUNTIME', // 普通错误
    ERROR_PROMISE: 'ERROR_PROMISE', // peomise error
    ERROR_CONSOLE: 'ERROR_CONSOLE', // console.error

    BEHAVIOR_XHR: 'BEHAVIOR_XHR', // 用户请求
    BEHAVIOR_XPATH: 'BEHAVIOR_XPATH', // 用户点击路径
    BEHAVIOR_FETCH: 'BEHAVIOR_FETCH', // 用户请求
    BEHAVIOR_CUSTOM: 'BEHAVIOR_CUSTOM', // 用户自定行为
    BEHAVIOR_URLCHANGE: 'BEHAVIOR_URLCHANGE', // 路由改变

    DURATION: 'DURATION', // 用户停留时间
    RESCOURCES: 'RESCOURCES'
};
```

## <a id="options">options</a>

```js
interface OptionsInterface {
    project_id: string; // 项目id
    origin: string; // server 地址
    frequency: number;
    isTest?: boolean;
    userId?: string;
}
```

| name       | describe         | explain                                                                      |
| ---------- | ---------------- | ---------------------------------------------------------------------------- |
| project_id | 项目 id          | 必填                                                                         |
| origin     | 后台上报服务地址 | 必填-端口默认为 9090                                                         |
| frequency  | 上报频率         | 非必填 -范围为 0-1， 默认为 1                                                |
| isTest     | 是否是测试环境   | 非必填 - 默认为 false-测试模式下打点数据仅供控制台打印浏览, 不会上传到系统中 |
| userId     | 业务用户 id      | 非必填 - 默认为 系统自动生成                                                 |

## 方法

| fn                                                                                     | describe   | explain                                                                        |
| -------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| createCustomErrorEvent(message: string, content: Object)                               | 自定义错误 | message： 错误信息标题，content: {}错误信息内容                                |
| createCustomBehaviorEvent(behaviorType: string,behaviorResult: object,message: string) | 自定义行为 | message： 错误信息标题，behaviorType:自定义行为类型，behaviorResult： 具体内容 |

## <a id="eventdomo">eventDomo</a>

```js
{
    type: 'BEHAVIOR_XHR',
    info: {
        message: '异步请求',
        url: 'http://localhost:8001/sockjs-node/info?t=1580906284133',
        method: 'GET',
        status: 200,
        responseSize: null,
        statusText: 'OK',
        success: true,
        duration: 17
    },
    options: {
        token: '9999',
        origin: 'http://localhost:9090',
        isTest: false,
        frequency: 1,
        userId: 'wall_KLSkzxldp0fxpyHXOKSuCrMJQoWMoKg2'
    },
    key: 'NtsGbhvxzDSm1ti2uffSue7u2UIFPVXo',
    version: '0.2.2',
    createTime: 1580906284151,
    currentUrl: 'http%3A%2F%2Flocalhost%3A8001%2F%3Fa%3D1',
    project_id: 1,
    time: 1581031275,
};
```

## TODO

-   [indexDB](https://github.com/xmoyking/localForage-cn) 存储，可以追寻用户行为路径，可以追踪到错误发生之前的用户行为
-   崩溃和卡顿
-   sourceMap
-   webpack 插件
-   用户访问应用次数记录统计(记录第一次加载， 记录刷新) session pv
-   每个页面首次加载时间统计(记录第一次加载) 路由切换机制-单页面和 pc

*   微信小程序
