/*
 * 用户行为
 * @Author: isam2016
 * @Date: 2019-12-19 14:42:13
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-19 15:22:10
 */
import {
    EventInterface,
    EngineInterface,
    AppInterface,
    XpathInterface,
    CustomBehavior,
    BehaviorCode
} from '../types';

// 用户在线时长统计
const OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
const SEND_MILL = 5 * 1000; // 每5s打点一次
class Behavior implements EngineInterface {
    WALL: AppInterface;
    constructor(wall: AppInterface) {
        this.WALL = wall;
        this.listenerClick();
        this.customBehavior();
    }

    private listenerClick() {
        let self = this;
        // 记录开始时间
        let lastTime = Date.now();
        document.addEventListener(
            'click',
            function(e: Event) {
                let xpath: string = self.getXpath(e.target);
                let inputValue: string =
                    (e.target as HTMLInputElement).value || '';
                let placeholder: string =
                    (e.target as HTMLInputElement).placeholder || '';
                let className: string = (e.target as any).className;

                if (inputValue.length > 20) {
                    inputValue = inputValue.substring(0, 20);
                }
                if (xpath) {
                    let xpathInfo: XpathInterface = {
                        message: '用户路径',
                        xpath,
                        inputValue,
                        placeholder,
                        className,
                        code: BehaviorCode['BEHAVIOR_XPATH']
                    };
                    let behaviorInfo: EventInterface = {
                        type: 'BEHAVIOR_XPATH',
                        info: xpathInfo
                    };
                    self.WALL(behaviorInfo);
                    // 记录用户停留时间
                    const now = Date.now();
                    const duration = now - lastTime;
                    if (duration > OFFLINE_MILL) {
                        lastTime = Date.now();
                    } else if (duration > SEND_MILL) {
                        let durationInfo = {
                            message: '用户停留时间',
                            duration_ms: duration
                        };
                        let durationEvent: EventInterface = {
                            type: 'DURATION',
                            info: durationInfo
                        };
                        lastTime = Date.now();
                        self.WALL(durationEvent);
                    }
                }
            },
            false
        );
    }
    private getXpath = element => {
        if (!(element instanceof Element)) {
            return '';
        }
        if (element.nodeType !== 1) {
            return '';
        }
        let rootElement = document.body;
        if (element === rootElement) {
            return '';
        }
        let tagName = element.tagName.toLocaleLowerCase();
        if (tagName === 'html' || tagName === 'body') {
            return '';
        }
        let xpath: string = '';

        while (element !== document) {
            let tag = element.tagName.toLocaleLowerCase();
            xpath = '/' + tag + xpath;
            element = element.parentNode;
        }
        return xpath;
    };

    public customBehavior() {
        /**
         * 用户自定义行为
         * @param behaviorType  行为类型
         * @param behaviorResult  行为结果
         * @param description 行为描述
         */
        this.WALL.createCustomBehaviorEvent = (
            behaviorType: string,
            behaviorResult: object,
            message: string
        ) => {
            let customBehavior: CustomBehavior = {
                message,
                behaviorType,
                behaviorResult,
                code: BehaviorCode['BEHAVIOR_CUSTOM']
            };
            let behaviorInfo: EventInterface = {
                type: 'BEHAVIOR_CUSTOM',
                info: customBehavior
            };
            self.WALL(behaviorInfo);
        };
    }
}

export default Behavior;
