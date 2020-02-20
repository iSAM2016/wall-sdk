import * as localForage from 'localforage';
//防止用户清空indexdb 每次都从新读取 LINLNODEIDS
export var createHead = function (listnode) {
    return localForage.getItem('LINLNODEIDS').then(function (value) {
        listnode.initLinkNode(value);
    });
};
// 设置value
export var setLocalEvent = function (wallEvent, listnode) {
    return localForage
        .setItem(wallEvent.key, JSON.stringify(wallEvent))
        .then(function (value) {
        //更新ids
        return listnode.insert(wallEvent.key);
    })
        .catch(function (err) {
        console.log(err);
    });
};
// 更新ids
export var updateEventIds = function (head) {
    localForage.setItem('LINLNODEIDS', JSON.stringify(head));
};
//# sourceMappingURL=localForage.js.map