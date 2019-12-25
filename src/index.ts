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

let wall: AppInterface = Application();
let listnode: ListNode = new ListNode();

// 添加时间和key和UA
wall.use(auxiliaryInfo);

// 对所有的ERROR设置上报频率
wall.use(frequency);

//TODO:对所有RESCOURCE 资源每页每天上报一次
//终止next
wall.use((event, next) => {
    next();
});

//对所有ERROR BEHAVIORC 数据记录
wall.use(async (event, next) => {
    // console.log(event);
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
    if (event.isUpload) {
        let ids: Array<string> = listnode.getFiveNodeKeys();
        let resultEvent = ids.reduce((mome: any, id) => {
            mome.push(localForage.getItem(id));
            return mome;
        }, []);

        Promise.all(resultEvent)
            .then(result => {
                return new Promise((resolve, reject) => {
                    let reportUrl = 'http://xxxx/report';
                    // let img = new Image();
                    // img.onload = function() {
                    //     alert('img is loaded');
                    //     // resolve(result);
                    // };
                    // img.onerror = function() {
                    //     reject('error!');
                    // };
                    // // new Image().src = `${reportUrl}?logs=${error}`;
                    // img.src = 'http://www.baidu.com/img.gif';
                    // resolve(result);
                });
            })
            .then(result => {
                next(); // TODO: 根据业务划分 是否TODO
                // console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        next();
    }
});

wall.listen([
    new TryCatch(wall),
    new Xhr(wall),
    new Behavior(wall),
    new Resources(wall)
]);

window.WALL = wall;

export default wall;
