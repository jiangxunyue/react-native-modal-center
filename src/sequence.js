import invariant from 'fbjs/lib/invariant';
class Sequence {
    cursor = null;
    addNode = (value, priority) => {
        invariant(value !== undefined && value.element, 'The Node\'s value must not be undefined');
        let key = value.element.key;
        if (this.cursor && key) {
            invariant(!this.cursor.findNodeWithKey(key), 'The ModalCenter already has a subModal with key -- "' + key + '"');
        }
        let newNode = new Node(value, priority);
        if (!this.cursor) {
            this.cursor = newNode;
        }else {
            let currentNextNode = this.cursor.findFistLessThan(priority);
            if (currentNextNode) {
                if (this.cursor === currentNextNode) {
                    this.cursor = newNode;
                }else {
                    newNode.setPrevNode(currentNextNode.prevNode);
                }
                newNode.setNextNode(currentNextNode);
                currentNextNode.setPrevNode(newNode);
            }else {
                let lastNode = this.cursor.findLastNode();
                newNode.setPrevNode(lastNode);
                lastNode.setNextNode(newNode);
            }
        }
    };

    shiftNode = () => {
        if (!this.cursor) return null;
        let target = this.cursor;
        this.cursor = this.cursor.nextNode;
        // 当nextNode不是null时
        if (this.cursor) this.cursor.setPrevNode(null);
        return target;
    };
    removeNode = (node) => {
        if (!node) return;
        if (node === this.cursor) {
            // 首node，移动cursor
            this.cursor = this.cursor.nextNode;
            // 当nextNode不是null时
            if (this.cursor) this.cursor.setPrevNode(null);
        }else {
            node.prevNode.setNextNode(node.nextNode);
            // 有nextNode，更改有nextNode的prevNode
            if (node.nextNode) node.nextNode.setPrevNode(node.prevNode);
        }
    };
    removeNodeByKey = (key) => {
        if (!this.cursor || !key) return null;
        let targetNode = this.cursor.findNodeWithKey(key);
        this.removeNode(targetNode)
    };
    removeAll = () => {
        this.cursor = null;
    };
}
class Node {
    prevNode = null;
    nextNode = null;
    value = null;
    priority = 1;
    constructor(value, priority) {
        this.priority = priority || 1;
        this.value = value;
    }

    setPrevNode = (prevNode) => {
        this.prevNode = prevNode
    };
    setNextNode = (nextNode) => {
        this.nextNode = nextNode;
    };
    // 找到第一个优先级比传入的优先级小的节点
    findFistLessThan = (priority) => {
        if (this.priority < priority) return this;
        if (this.nextNode) return this.nextNode.findFistLessThan(priority);
        return null;
    };
    // 取出最后一个节点
    findLastNode() {
        if (this.nextNode) return this.nextNode.findLastNode();
        return this;
    };
    findNodeWithKey = (key) => {
        if (this.value.element.key === key) {
            return this;
        }else {
            if (this.nextNode) return this.nextNode.findNodeWithKey(key);
        }
        return null;
    }
}

module.exports = {
    Sequence
};