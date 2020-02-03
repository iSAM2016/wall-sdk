import Application from '@app/core/wall';
import { AppInterface, NodeInterface } from '@app/types';
import TryCatch from '@app/integrations/trycatch';
import Behavior from '@app/integrations/behavior';
import Resources from '@app/integrations/resources';
import ListNode from './util/linknode';
import Xhr from '@app/integrations/xhr';
import { auxiliaryInfo, frequency } from '@app/middle';
import { createHead, setLocalEvent, updateEventIds } from '@app/middle';
import * as localForage from 'localforage';
import { debugLogger } from '@app/util';
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
wall.use(async (event, next) => {
    if (event.type.includes('BEHAVIOR') || event.type.includes('ERROR')) {
        await createHead(listnode);
        let head = await setLocalEvent(event, listnode);
        await updateEventIds(head as NodeInterface);
        next();
    }
    next();
});

// 对当前event有upload属性并且为true的 取出历史前四条立即上报
wall.use(async (event, next) => {
    if (event.options.isTest) {
        // 测试环境不上传
        next();
    }
    if (event.isUpload) {
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
                    img.onerror = function() {
                        reject('error!');
                    };
                    img.src = `${event.options.origin}?d=${encodeURIComponent(
                        JSON.stringify(event)
                    )}`;
                });
            })
            .then(result => {
                next(); //TODO: 根据业务划分 是否TODO
            })
            .catch(err => {
                console.log(err);
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
