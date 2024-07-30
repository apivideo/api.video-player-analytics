export class Queue {
    private stack: any;
    private maxLength: number;

    constructor(maxLength: number = 0) {
        this.stack = [];
        this.maxLength = maxLength;
    }

    public getLength() {
        return this.stack.length;
    }

    public isEmpty(): boolean {
        return this.stack.length === 0;
    }

    public enqueue(item: any) {
        // If maxItems is set, remove the first item of the stack.
        if (this.maxLength > 0 && this.stack.length === this.maxLength) {
            this.stack.shift();
        }

        this.stack.push(item);
    }

    public dequeue() {
        return this.stack.splice(0);
    }

    public upsertLast(item: any) {
        if (this.isEmpty()) {
            return;
        }

        return this.stack[this.stack.length - 1] = item;
    }

    public peekLast() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.stack[this.stack.length - 1];
    }
}
