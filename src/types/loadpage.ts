import { InfoInterface } from './baseInfo';

/***
 * 页面加载信息
 */
export type loadType = 'navigate' | 'reload';
export interface loadPageInterface extends InfoInterface {
    loadType: loadType; // 页面加载类型
    ttfb: number;
    request: number;
    connect: number;
    domReady: number;
    redirect: number;
    appcache: number;
    loadEvent: number;
    unloadEvent: number;
    loadPageTime: number;
    lookupDomain: number;
}
