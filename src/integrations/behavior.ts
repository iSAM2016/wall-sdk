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
    URLInfoInterface
} from '@app/types';
import { addEventListener } from '../util';
class Behavior implements EngineInterface {
    WALL: AppInterface;
    constructor(wall: AppInterface) {
        this.WALL = wall;
        this.listenerClick();
        this.listenerHashChange();
    }

    private listenerClick() {
        let self = this;
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
                        className
                    };
                    let behaviorInfo: EventInterface = {
                        type: 'BEHAVIORXPATH',
                        info: xpathInfo
                    };
                    self.WALL(behaviorInfo);
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
    /**
     * hansh路由
     */
    private listenerHashChange() {
        if (!('onhashchange' in window.document.body)) {
            return false;
        }
        let self = this;
        let URLInfo: URLInfoInterface = {
            message: '用户页面跳转',
            oldURL: '',
            newURL: ''
        };
        let currentHashchangeTime: number = 0;
        let currentPopchangeTime: number;

        addEventListener(
            'hashchange',
            (e: HashChangeEvent) => {
                currentHashchangeTime = +new Date();
                URLInfo.oldURL = e.oldURL;
                URLInfo.newURL = e.newURL;
                return true;
            },
            false
        );

        addEventListener(
            'popstate',
            e => {
                currentPopchangeTime = +new Date();
                setTimeout(() => {
                    if (!(currentPopchangeTime - currentHashchangeTime < 400)) {
                        // behaviorInfo.info.message = { kl: 0 };
                        console.log(e);
                    }

                    let behaviorInfo: EventInterface = {
                        type: 'BEHAVIORURLCHANGE',
                        info: URLInfo
                    };

                    self.WALL(behaviorInfo);
                }, 500);
            },
            false
        );
    }
}

export default Behavior;
