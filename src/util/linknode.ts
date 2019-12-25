/* 维护id， 采用了链表为扩展做准备
 * @Author: isam2016
 * @Date: 2019-12-23 12:11:40
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-23 17:29:06
 */

import { NodeInterface } from '@app/types';
/**
 * 链表
 */
class ListNode {
    head: null | NodeInterface;
    constructor() {
        this.head = null;
    }
    public initLinkNode(head) {
        try {
            this.head = JSON.parse(head);
        } catch (error) {
            console.log(error);
        }
    }
    private createNode(key: string): NodeInterface {
        return {
            next: null,
            key
        };
    }
    public insert(value: string): NodeInterface {
        let node: NodeInterface = this.createNode(value);
        if (this.head) {
            node.next = this.head;
        }
        this.head = node;
        return this.head;
    }

    // search(key) {
    //   let node: Node = this.head;
    //   while (node !== null && node.key !== key) {
    //     node = node.next;
    //   }
    //   return node;
    // }
    getFiveNodeKeys() {
        let fiveNodeKeys: Array<string> = [];
        let currentNode: NodeInterface = this.head;
        let index = 0;
        while (currentNode && index < 5) {
            index += 1;
            fiveNodeKeys.push(currentNode.key);
            currentNode = currentNode.next as NodeInterface;
        }
        return fiveNodeKeys;
    }
    delete(node) {
        const { prev, next } = node;
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
    }
}

export default ListNode;
