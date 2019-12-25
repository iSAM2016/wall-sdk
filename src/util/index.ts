import { DeviceInterface } from '@app/types';
export const addEventListener = (name: string, callback, useCapture) => {
    if (window.addEventListener) {
        return window.addEventListener(name, callback, useCapture);
    } else if ((window as any).attachEvent) {
        return (window as any).attachEvent('on' + name, callback);
    }
};

// 过滤无效数据
export const filterTime = (a: number, b: number): number | void => {
    return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
};

export const onload = cb => {
    if (document.readyState === 'complete') {
        cb();
    }
    addEventListener('load', cb, false);
};

export const resolvePerformanceTiming = timing => ({
    initiatorType: timing.initiatorType,
    name: timing.name,
    duration: parseInt(timing.duration),
    redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
    dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
    connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
    network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时
    send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
    receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
    request: filterTime(timing.responseEnd, timing.requestStart), // 总时间
    ttfb: filterTime(timing.responseStart, timing.requestStart) // 首字节时间
});

export const resolveEntries = entries =>
    entries.map(item => resolvePerformanceTiming(item));

export const getDevice = (): DeviceInterface => {
    let device: DeviceInterface = {
        os: 'web',
        deviceName: 'PC'
    };
    let ua = navigator.userAgent;
    let android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    let ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    let iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    let mobileInfo = ua.match(/Android\s[\S\s]+Build\//);
    device.ios = false;
    device.android = false;
    device.iphone = false;
    device.ipad = false;
    device.androidChrome = false;
    device.isWeixin = /MicroMessenger/i.test(ua);

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua
                .toLowerCase()
                .split('version/')[1]
                .split(' ')[0];
        }
    }

    // 如果是ios, deviceName 就设置为iphone，根据分辨率区别型号
    if (device.iphone) {
        device.deviceName = 'iphone';
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        if (screenWidth === 320 && screenHeight === 480) {
            device.deviceName = 'iphone 4';
        } else if (screenWidth === 320 && screenHeight === 568) {
            device.deviceName = 'iphone 5/SE';
        } else if (screenWidth === 375 && screenHeight === 667) {
            device.deviceName = 'iphone 6/7/8';
        } else if (screenWidth === 414 && screenHeight === 736) {
            device.deviceName = 'iphone 6/7/8 Plus';
        } else if (screenWidth === 375 && screenHeight === 812) {
            device.deviceName = 'iphone X/S/Max';
        }
    } else if (device.ipad) {
        device.deviceName = 'ipad';
    } else if (mobileInfo) {
        var info = mobileInfo[0];
        var deviceName = info.split(';')[1].replace(/Build\//g, '');
        device.deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, '');
    }
    // 浏览器模式, 获取浏览器信息
    // TODO 需要补充更多的浏览器类型进来
    if (ua.indexOf('Mobile') == -1) {
        var agent = navigator.userAgent.toLowerCase();
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;

        device.browserName = '未知';
        //IE
        if (agent.indexOf('msie') > 0) {
            var browserInfo = agent.match(regStr_ie)[0];
            device.browserName = browserInfo.split('/')[0];
            device.browserVersion = browserInfo.split('/')[1];
        }
        //firefox
        if (agent.indexOf('firefox') > 0) {
            var browserInfo = agent.match(regStr_ff)[0];
            device.browserName = browserInfo.split('/')[0];
            device.browserVersion = browserInfo.split('/')[1];
        }
        //Safari
        if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
            var browserInfo = agent.match(regStr_saf)[0];
            device.browserName = browserInfo.split('/')[0];
            device.browserVersion = browserInfo.split('/')[1];
        }
        //Chrome
        if (agent.indexOf('chrome') > 0) {
            var browserInfo = agent.match(regStr_chrome)[0];
            device.browserName = browserInfo.split('/')[0];
            device.browserVersion = browserInfo.split('/')[1];
        }
    }
    // Webview
    device.webView =
        (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Export object
    return device;
};

export const randomKey = (min: number, max?: number) => {
    let str: string = '',
        range: number = min,
        pos: number = 0,
        arr = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        ];

    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};
