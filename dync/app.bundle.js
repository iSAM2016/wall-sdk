(function(source) {
    // webpackBootstrap
    // install a JSONP callback for chunk loading
    function webpackJsonpCallback(data) {
        /****
         * 3. 异步加载模块
         */
        /****
         * data =>  (chunkIds,moreModules=>{path:value})
         */
        console.log(data);
        var chunkIds = data[0]; // 可能多个模块
        var moreModules = data[1];

        // add "moreModules" to the source object,
        // then flag all "chunkIds" as loaded and fire callback
        var moduleId,
            chunkId,
            i = 0,
            resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            //  向缓存中获取 key 为[chunkId], 的数据
            /****
             *  installedChunks[0] = [resolve,reject];
             */
            if (installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            //说明该模块加载完毕
            installedChunks[chunkId] = 0;
        }
        console.log(moreModules);
        for (moduleId in moreModules) {
            console.log(moduleId);
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                //  把 异步加载 函数体放到主集合中
                source[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);

        while (resolves.length) {
            resolves.shift()();
        }
    }

    // The module cache
    // 缓存表
    var installedModules = {};

    // object to store loaded and loading chunks
    // undefined = chunk not loaded, null = chunk preloaded/prefetched
    // Promise = chunk loading, 0 = chunk loaded

    // 模块是否被加载
    //  0：文件被加载完成  Promise 文件正在被加载
    var installedChunks = {
        app: 0
    };

    // script path function
    //  返回路径
    function jsonpScriptSrc(chunkId) {
        return (
            __webpack_require__.p + '' + ({}[chunkId] || chunkId) + '.bundle.js'
        );
    }

    // Create a new module (and put it into the cache)
    // 创建一个新的缓存并放入缓存表
    // ？？ 始终用的是这个对象 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

    function __webpack_require__(moduleId) {
        // Check if module is in cache
        // 检查是否有缓存
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        // 创建一个新的缓存并放入缓存表
        var module = (installedModules[moduleId] = {
            i: moduleId, // 模块id
            l: false, // 是否加载
            exports: {} // 导出的内容
        });
        console.log(module);

        // Execute the module function
        source[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
    }

    // This file contains only the entry chunk.
    // The chunk loading function for additional chunks
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];

        // JSONP chunk loading for javascript

        var installedChunkData = installedChunks[chunkId]; //缓存中没有找到文件
        // 该模块已经被加载
        if (installedChunkData !== 0) {
            // 0 means "already installed".

            // a Promise means "currently loading".
            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                // setup Promise in chunk cache
                //  开始加载模块
                var promise = new Promise(function(resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [
                        resolve,
                        reject
                    ];
                });
                promises.push((installedChunkData[2] = promise));
                console.log(installedChunkData);
                console.log(promises);
                // start chunk loading
                var script = document.createElement('script');
                var onScriptComplete;

                script.charset = 'utf-8';
                script.timeout = 120;
                if (__webpack_require__.nc) {
                    script.setAttribute('nonce', __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);

                onScriptComplete = function(event) {
                    // avoid mem leaks in IE.
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        if (chunk) {
                            var errorType =
                                event &&
                                (event.type === 'load'
                                    ? 'missing'
                                    : event.type);
                            var realSrc =
                                event && event.target && event.target.src;
                            var error = new Error(
                                'Loading chunk ' +
                                    chunkId +
                                    ' failed.\n(' +
                                    errorType +
                                    ': ' +
                                    realSrc +
                                    ')'
                            );
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                //  超时验证
                var timeout = setTimeout(function() {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };
    // expose the source object (__webpack_modules__)
    __webpack_require__.m = source;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // define __esModule on exports
    __webpack_require__.r = function(exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: 'Module'
            });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.p = './';

    //  向 window 注册 webpackJsonp(push 方法)

    var jsonpArray = (window['webpackJsonp'] = window['webpackJsonp'] || []);
    //jsonpArray=>[]
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    //jsonpArray=>[]
    jsonpArray.push = webpackJsonpCallback;
    console.log(window['webpackJsonp']);
    // jsonpArray = jsonpArray.slice();
    // console.log(window['webpackJsonp']);
    // for (var i = 0; i < jsonpArray.length; i++)
    //     webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;

    // Load entry module and return exports
    /****
     * 2. 开始加载模块 并 返回浏览器内容
     *  __webpack_require__.s = 0 开始加载初始主文件 模块初始id为0
     */
    return __webpack_require__((__webpack_require__.s = 0));
})(
    /****
     *  1. 开始（webpack 4.15）
     *
     *  闭包，出事参数是  source {key:value} 的形式注入
     *  key: 是文件的相对路径
     *  value: 是一个fn（module，exports,__webpack_require__ ）一个嵌套函数，吧内容放到嵌套函数中
     *    module.模块名
     *    exports: 模块包含
     *    __webpack_require__： 工具函数
     *
     *  //eval TODO:// 作用
     *
     */
    {
        './dync.js': function(
            module,
            __webpack_exports__,
            __webpack_require__
        ) {
            'use strict';
            console.log(0);
            // eval(
            //     '__webpack_require__.r(__webpack_exports__);\n var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./index.js");\n\nconsole.log(_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].name);\n\nvar block = document.getElementById(\'root\');\nblock.addEventListener(\'click\', function() {\n    __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./lodash */ "./lodash.js"))\n        .then(({ default: _ }) => {\n            console.log(_.name);\n        })\n        .catch(error => \'An error occurred while loading the component\');\n})'
            // );
            /****
             * 3. 开始加载index模块
             */
            var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                './index.js'
            );
            console.log(_index_js__WEBPACK_IMPORTED_MODULE_0__['default'].name);
            var block = document.getElementById('root');
            block.addEventListener('click', function() {
                __webpack_require__
                    .e(/*! import() */ 0)
                    /****
                     * 5. 异步加载模块./lodash.js
                     */
                    .then(__webpack_require__.bind(null, './lodash.js'))
                    .then(({ default: _ }) => {
                        console.log(_.name);
                    })
                    .catch(
                        error => 'An error occurred while loading the component'
                    );
            });
        },

        './index.js': function(
            module,
            __webpack_exports__,
            __webpack_require__
        ) {
            'use strict';
            eval('__webpack_exports__["default"] = ({name: \'idam2016\'})');
        },

        0: function(module, exports, __webpack_require__) {
            eval('module.exports = __webpack_require__("./dync.js");');
        }
    }
);

/****
 * 1. window[windowJson].push=webpackJsonCallBack; 把json 的回调挂了在window[windowJson].push 上
 * 2. 调用 __webpack_require__.e 告诉内部加载0.js 并且返回一个promise all
 * 3. 把 modules 的属性上吧当前0.js 放到modules 的对象内 把后加载的模块放到了modules
 * 4. 引用加载的模块
 * 5. 下一步取值
 */
