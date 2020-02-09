import { EventInterface, NextInterface, DeviceInterface } from '../types';
import { randomKey, getDevice } from '../util';
const Resource = require('../../package.json');

export const auxiliaryInfo = (event: EventInterface, next: NextInterface) => {
    let {
        deviceName,
        os,
        osVersion,
        browserName,
        browserVersion
    }: DeviceInterface = getDevice();
    // 后台自动获取
    let deviceInfo: DeviceInterface = {
        deviceName,
        browserName,
        browserVersion,
        os: os + (osVersion ? String(osVersion) : '')
    };

    event.userId = event.options.userId;
    event.uuid = event.options.uuid; // 设备id
    event.key = event.options.token;
    event.version = Resource.version;
    event.createTime = +new Date();
    event.currentUrl = encodeURIComponent(window.location.href); // 页面url

    next();
};
