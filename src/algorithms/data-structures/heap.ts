export default class MinHeap<T> {
    public readonly heap: T[];

    constructor(readonly compareFn: (o1: T, o2: T) => number) {
        this.heap = [];
    }

    getLeftChildIndex = (parentIndex: number) => 2 * parentIndex + 1;
    getRightChildIndex = (parentIndex: number) => 2 * parentIndex + 2;
    getParentIndex = (childIndex: number) => Math.floor((childIndex - 1) / 2);

    hasLeftChild = (index: number) => this.getLeftChildIndex(index) < this.heap.length;
    hasRightChild = (index: number) => this.getRightChildIndex(index) < this.heap.length;
    hasParent = (index: number) => this.getParentIndex(index) >= 0;

    getLeftChild = (index: number) => this.heap[this.getLeftChildIndex(index)];
    getRightChild = (index: number) => this.heap[this.getRightChildIndex(index)];
    getParent = (index: number) => this.heap[this.getParentIndex(index)];

    swap = (index1: number, index2: number) => {
        let temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    };

    add = (item: T) => {
        this.heap[this.heap.length] = item;
        this.heapifyUp();
    };

    shift = () => {
        let item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return item;
    };

    decrease = (index: number, decreasedItem: T) => {
        this.heap[index] = decreasedItem;
        this.heapifyUp(index);
    };

    find = (item: T, equalsFn = (itemA: T) => itemA === item) => {
        for (let i = 0; i < this.heap.length; i++) {
            let currentItem = this.heap[i];
            if (equalsFn(currentItem)) {
                return {index: i, item: currentItem};
            }
        }
        return null;
    };

    heapifyUp = (index = this.heap.length - 1) => {
        while (this.hasParent(index) && this.compareFn(this.heap[index], this.getParent(index)) < 0) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    };

    heapifyDown = () => {
        let index = 0;

        while (this.hasLeftChild(index)) {
            let smallerChildIndex =
                this.hasRightChild(index) && this.compareFn(this.getRightChild(index), this.getLeftChild(index)) < 0
                    ? this.getRightChildIndex(index)
                    : this.getLeftChildIndex(index);

            if (this.compareFn(this.heap[index], this.heap[smallerChildIndex]) < 0) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    };
}
