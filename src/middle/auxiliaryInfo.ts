import { EventInterface, NextInterface, DeviceInterface } from '@app/types';
import { randomKey, getDevice } from '@app/util';
export const auxiliaryInfo = (event: EventInterface, next: NextInterface) => {
    console.log(event);
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
    // this.pageKey = utils.getPageKey(); //TODO: 用于区分页面，所对应唯一的标识，每个新页面对应一个值
    event.key = randomKey(32);
    event.createTime = +new Date();
    event.deviceInfo = deviceInfo;
    event.currentUrl = encodeURIComponent(window.location.href); // 页面url

    // TODO 位置信息, 待处理
    // this.monitorIp = ''; // 用户的IP地址
    // this.country = 'china'; // 用户所在国家
    // this.province = ''; // 用户所在省份
    // this.city = ''; // 用户所在城市

    next();
};
``;
