import Application from './core/wall';
import { AppInterface, NodeInterface } from './types';
import TryCatch from './integrations/trycatch';
import Behavior from './integrations/behavior';
import Resources from './integrations/resources';
import ListNode from './util/linknode';
import Xhr from './integrations/xhr';
import { auxiliaryInfo, frequency } from './middle';
import { createHead, setLocalEvent, updateEventIds } from './middle';
import * as localForage from 'localforage';
import { debugLogger } from './util';
let wall: AppInterface = Application();
let listnode: ListNode = new ListNode();

// 添加时间和key和UA(等辅助信息)
wall.use(auxiliaryInfo);

// 对所有的ERROR设置上报频率
wall.use(frequency);

//debugLogger->event
wall.use((event, next) => {
    debugLogger(event);
    next();
});

//对所有ERROR BEHAVIORC 数据记录
// wall.use(async (event, next) => {
//     if (event.type.includes('BEHAVIOR') || event.type.includes('ERROR')) {
//         await createHead(listnode);
//         let head = await setLocalEvent(event, listnode);
//         await updateEventIds(head as NodeInterface);
//         next();
//     }
//     next();
// });

// 对当前event有upload属性并且为true的 取出历史前四条立即上报
wall.use(async (event, next) => {
    if (!event.options.isTest) {
        let ids: Array<string> = listnode.getFiveNodeKeys();
        let resultEvent = ids.reduce((mome: any, id) => {
            mome.push(localForage.getItem(id));
            return mome;
        }, []);

        Promise.all(resultEvent)
            .then(result => {
                return new Promise((resolve, reject) => {
                    let reportUrl: string = wall.options.origin;
                    let img = new Image();
                    img.onload = function() {
                        resolve(result);
                    };
                    img.onerror = function(e) {
                        reject(e);
                    };
                    img.src = `${event.options.origin}?d=${encodeURIComponent(
                        JSON.stringify(event)
                    )}.gif`;
                });
            })
            .then(result => {
                next(); //TODO: 根据业务划分 是否TODO
            })
            .catch(err => {
                // 图片加载错误
                // console.log(err);
            });
    } else {
        next();
    }
});
// 顺序不能更该
wall.listen([
    new TryCatch(wall),
    new Xhr(wall),
    new Behavior(wall),
    new Resources(wall)
]);

window.WALL = wall;

export default wall;
