/* 维护id， 采用了链表为扩展做准备
 * @Author: isam2016
 * @Date: 2019-12-23 12:11:40
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-23 17:29:06
 */
/**
 * 链表
 */
var ListNode = /** @class */ (function () {
    function ListNode() {
        this.head = null;
    }
    ListNode.prototype.initLinkNode = function (head) {
        try {
            this.head = JSON.parse(head);
        }
        catch (error) {
            console.log(error);
        }
    };
    ListNode.prototype.createNode = function (key) {
        return {
            next: null,
            key: key
        };
    };
    ListNode.prototype.insert = function (value) {
        var node = this.createNode(value);
        if (this.head) {
            node.next = this.head;
        }
        this.head = node;
        return this.head;
    };
    // search(key) {
    //   let node: Node = this.head;
    //   while (node !== null && node.key !== key) {
    //     node = node.next;
    //   }
    //   return node;
    // }
    ListNode.prototype.getFiveNodeKeys = function () {
        var fiveNodeKeys = [];
        var currentNode = this.head;
        var index = 0;
        while (currentNode && index < 5) {
            index += 1;
            fiveNodeKeys.push(currentNode.key);
            currentNode = currentNode.next;
        }
        return fiveNodeKeys;
    };
    ListNode.prototype.delete = function (node) {
        var prev = node.prev, next = node.next;
        delete node.prev;
        delete node.next;
        if (node === this.head) {
            this.head = next;
        }
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev;
        }
    };
    return ListNode;
}());
export default ListNode;
//# sourceMappingURL=linknode.js.map