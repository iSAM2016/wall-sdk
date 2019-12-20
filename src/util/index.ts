export const addEventListener = (name, callback, useCapture) => {
  if (window.addEventListener) {
    return window.addEventListener(name, callback, useCapture);
  } else if ((window as any).attachEvent) {
    return (window as any).attachEvent("on" + name, callback);
  }
};

// 过滤无效数据
export const filterTime = (a: number, b: number): number | void => {
  return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
};

export const onload = cb => {
  if (document.readyState === "complete") {
    cb();
  }
  addEventListener("load", cb, false);
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
