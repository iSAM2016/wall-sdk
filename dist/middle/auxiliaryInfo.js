import { randomKey, getDevice } from '../util';
var Resource = require('../../package.json');
export var auxiliaryInfo = function (wallEvent, next) {
    var _a = getDevice(), deviceName = _a.deviceName, os = _a.os, osVersion = _a.osVersion, browserName = _a.browserName, browserVersion = _a.browserVersion;
    // 后台自动获取
    var deviceInfo = {
        deviceName: deviceName,
        browserName: browserName,
        browserVersion: browserVersion,
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
//# sourceMappingURL=auxiliaryInfo.js.map