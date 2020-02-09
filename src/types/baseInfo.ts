import { OptionsInterface } from './options';
import { DeviceInterface } from './device';
export type EventType = {
    ERROR_XHR: 'ERROR_XHR'; // xhrerror
    ERROR_LINK: 'ERROR_LINK'; //静态资源 link加载错误
    ERROR_IMAGE: 'ERROR_IMAGE'; //静态资源 img
    ERROR_SCRIPT: 'ERROR_SCRIPT'; // 静态资源 script加载错误
    ERROR_CUSTOM: 'ERROR_CUSTOM'; // 用户自定义错误
    ERROR_RUNTIME: 'ERROR_RUNTIME'; // 普通错误
    ERROR_PROMISE: 'ERROR_PROMISE'; // peomise error
    ERROR_CONSOLE: 'ERROR_CONSOLE'; // console.error

    BEHAVIOR_XHR: 'BEHAVIOR_XHR'; // 用户请求
    BEHAVIOR_XPATH: 'BEHAVIOR_XPATH'; // 用户点击路径
    BEHAVIOR_FETCH: 'BEHAVIOR_FETCH'; // 用户请求
    BEHAVIOR_CUSTOM: 'BEHAVIOR_CUSTOM'; // 用户自定行为
    BEHAVIOR_URLCHANGE: 'BEHAVIOR_URLCHANGE'; // 路由改变

    DURATION: 'DURATION'; // 用户停留时间
    RESCOURCES: 'RESCOURCES';
};
// 用户行为标识
export enum BehaviorCode {
    BEHAVIOR_XHR, // 用户请求
    BEHAVIOR_XPATH, // 用户点击路径
    BEHAVIOR_FETCH, // 用户请求
    BEHAVIOR_CUSTOM, // 用户自定行为
    BEHAVIOR_DURATION, // 用户停留时间
    BEHAVIOR_URLCHANGE // 路由改变
}

export interface EventInterface {
    type: keyof EventType;
    info: InfoInterface; // 业务信息 error 信息 行为信息
    key?: string; // 每个event 都有自己的 唯一key
    version?: number; // sdk 版本
    isUpload?: boolean; // 是否立即上报
    currentUrl?: string; // 页面url // TODO: 获取页面唯一标识
    createTime?: number; // event创建时间
    options?: OptionsInterface; // wall 初始化信息
    deviceInfo?: DeviceInterface;
    userId?: string; // 用户id
    uuid?: string; // 设备id
}

export interface InfoInterface {
    message: string;
}
