/*
 * 用户行为
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-19 15:22:10
 */
import { BehaviorCode } from '../types';
// 用户在线时长统计
var OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
var SEND_MILL = 5 * 1000; // 每5s打点一次
var Behavior = /** @class */ (function () {
    function Behavior(wall) {
        this.getXpath = function (element) {
            if (!(element instanceof Element)) {
                return '';
            }
            if (element.nodeType !== 1) {
                return '';
            }
            var rootElement = document.body;
            if (element === rootElement) {
                return '';
            }
            var tagName = element.tagName.toLocaleLowerCase();
            if (tagName === 'html' || tagName === 'body') {
                return '';
            }
            var xpath = '';
            while (element !== document) {
                var tag = element.tagName.toLocaleLowerCase();
                xpath = '/' + tag + xpath;
                element = element.parentNode;
            }
            return xpath;
        };
        this.WALL = wall;
        this.listenerClick();
        this.customBehavior();
    }
    Behavior.prototype.listenerClick = function () {
        var self = this;
        // 记录开始时间
        var lastTime = Date.now();
        document.addEventListener('click', function (e) {
            var xpath = self.getXpath(e.target);
            var inputValue = e.target.value || '';
            var placeholder = e.target.placeholder || '';
            var className = e.target.className;
            if (inputValue.length > 20) {
                inputValue = inputValue.substring(0, 20);
            }
            if (xpath) {
                var xpathInfo = {
                    message: '用户路径',
                    xpath: xpath,
                    inputValue: inputValue,
                    placeholder: placeholder,
                    className: className,
                    code: BehaviorCode['BEHAVIOR_XPATH']
                };
                var behaviorInfo = {
                    type: 'BEHAVIOR_XPATH',
                    info: xpathInfo
                };
                self.WALL(behaviorInfo);
                // 记录用户停留时间
                var now = Date.now();
                var duration = now - lastTime;
                if (duration > OFFLINE_MILL) {
                    lastTime = Date.now();
                }
                else if (duration > SEND_MILL) {
                    var durationInfo = {
                        message: '用户停留时间',
                        duration_ms: duration
                    };
                    var durationEvent = {
                        type: 'DURATION',
                        info: durationInfo
                    };
                    lastTime = Date.now();
                    self.WALL(durationEvent);
                }
            }
        }, false);
    };
    Behavior.prototype.customBehavior = function () {
        /**
         * 用户自定义行为
         * @param behaviorType  行为类型
         * @param behaviorResult  行为结果
         * @param description 行为描述
         */
        this.WALL.createCustomBehaviorEvent = function (behaviorType, behaviorResult, message) {
            var customBehavior = {
                message: message,
                behaviorType: behaviorType,
                behaviorResult: behaviorResult,
                code: BehaviorCode['BEHAVIOR_CUSTOM']
            };
            var behaviorInfo = {
                type: 'BEHAVIOR_CUSTOM',
                info: customBehavior
            };
            self.WALL(behaviorInfo);
        };
    };
    return Behavior;
}());
export default Behavior;
//# sourceMappingURL=behavior.js.map