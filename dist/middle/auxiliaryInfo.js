import { randomKey, getDevice } from '../util';
var Resource = require('../../package.json');
export var auxiliaryInfo = function (event, next) {
    var _a = getDevice(), deviceName = _a.deviceName, os = _a.os, osVersion = _a.osVersion, browserName = _a.browserName, browserVersion = _a.browserVersion;
    // 后台自动获取
    var deviceInfo = {
        deviceName: deviceName,
        browserName: browserName,
        browserVersion: browserVersion,
        os: os + (osVersion ? String(osVersion) : '')
    };
    event.userId = event.options.userId;
    event.uuid = event.options.uuid; // 设备id
    event.key = randomKey(32);
    event.project_id = event.options.project_id;
    event.version = Resource.version;
    event.createTime = +new Date();
    event.currentUrl = encodeURIComponent(window.location.href); // 页面url
    next();
};
//# sourceMappingURL=auxiliaryInfo.js.map