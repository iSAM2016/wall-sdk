import * as localForage from 'localforage';
import { NodeInterface, EventInterface } from '../types';

//防止用户清空indexdb 每次都从新读取 LINLNODEIDS
export const createHead = listnode => {
    return localForage.getItem('LINLNODEIDS').then(value => {
        listnode.initLinkNode(value);
    });
};

// 设置value
export const setLocalEvent = (wallEvent: EventInterface, listnode) => {
    return localForage
        .setItem(wallEvent.key, JSON.stringify(wallEvent))
        .then(value => {
            //更新ids
            return listnode.insert(wallEvent.key);
        })
        .catch(err => {
            console.log(err);
        });
};

// 更新ids
export const updateEventIds = (head: NodeInterface) => {
    localForage.setItem('LINLNODEIDS', JSON.stringify(head));
};
