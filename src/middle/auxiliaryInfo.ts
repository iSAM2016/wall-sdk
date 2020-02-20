import { EventInterface, NextInterface, DeviceInterface } from '../types';
import { randomKey, getDevice } from '../util';
const Resource = require('../../package.json');

export const auxiliaryInfo = (
    wallEvent: EventInterface,
    next: NextInterface
) => {
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

    wallEvent.userId = wallEvent.options.userId;
    wallEvent.uuid = wallEvent.options.uuid; // 设备id
    wallEvent.key = randomKey(32);
    wallEvent.project_id = wallEvent.options.project_id;
    wallEvent.version = Resource.version;
    wallEvent.createTime = +new Date();
    wallEvent.currentUrl = encodeURIComponent(window.location.href); // 页面url

    next();
};
