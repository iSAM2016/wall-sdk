import * as localForage from "localforage";
import { NodeInterface, BaseInfoInterface } from "@app/types";

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

export const randomKey = (min: number, max?) => {
  let str: string = "",
    range: number = min,
    pos: number = 0,
    arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];

  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};

//防止用户清空indexdb 每次都从新读取 LINLNODEIDS
export const createHead = listnode => {
  return localForage.getItem("LINLNODEIDS").then(value => {
    listnode.initLinkNode(value);
  });
};

// 设置value
export const setLocalEvent = (event: BaseInfoInterface, listnode) => {
  return localForage
    .setItem(event.key, JSON.stringify(event))
    .then(value => {
      //更新ids
      return listnode.insert(event.key);
    })
    .catch(err => {
      console.log(err);
    });
};

// 更新ids
export const updateEventIds = (head: NodeInterface) => {
  localForage.setItem("LINLNODEIDS", JSON.stringify(head));
};
