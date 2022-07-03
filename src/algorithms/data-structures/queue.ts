export default class Queue<T> {
    public readonly elements: T[];
    public head: number;

    constructor() {
        this.elements = [];
        this.head = 0;
    }

    enqueue(element: T) {
        this.elements[this.elements.length] = element;
    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }
}