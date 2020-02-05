import * as localForage from 'localforage';
import { NodeInterface, EventInterface } from '../types';

//防止用户清空indexdb 每次都从新读取 LINLNODEIDS
export const createHead = listnode => {
    return localForage.getItem('LINLNODEIDS').then(value => {
        listnode.initLinkNode(value);
    });
};

// 设置value
export const setLocalEvent = (event: EventInterface, listnode) => {
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
    localForage.setItem('LINLNODEIDS', JSON.stringify(head));
};
