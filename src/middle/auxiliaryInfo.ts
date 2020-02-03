import { EventInterface, NextInterface, DeviceInterface } from '@app/types';
import { randomKey, getDevice } from '@app/util';
const Resource = require('../../package.json');

export const auxiliaryInfo = (event: EventInterface, next: NextInterface) => {
    let {
        deviceName,
        os,
        osVersion,
        browserName,
        browserVersion
    }: DeviceInterface = getDevice();
    let deviceInfo: DeviceInterface = {
        deviceName,
        browserName,
        browserVersion,
        os: os + (osVersion ? String(osVersion) : '')
    };
    event.key = randomKey(32);
    event.version = Resource.version;
    event.createTime = +new Date();
    event.deviceInfo = deviceInfo;
    event.currentUrl = encodeURIComponent(window.location.href); // 页面url

    next();
};
