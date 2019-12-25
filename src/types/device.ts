/**
 * 设备信息
 */
export interface DeviceInterface {
    os: string;
    deviceName: string;
    ios?: boolean;
    ipad?: boolean;
    iphone?: boolean;
    android?: boolean;
    isWeixin?: boolean;
    osVersion?: string;
    devandroid?: string;
    browserName?: string;
    browserVersion?: string;
    androidChrome?: boolean;
    webView?: RegExpMatchArray;
}
