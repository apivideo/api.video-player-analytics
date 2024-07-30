import { Queue } from '../../databus/queue';


describe('queue', () => {
    describe('Queue', () => {
        let queue: Queue;

        beforeEach(() => {
            queue = new Queue();
        });

        describe('isEmpty()', () => {
            test('should return true when no item has been queued in the stack', () => {
                expect(queue.isEmpty()).toBe(true);
            });
        });

        describe('enqueue()', () => {
            test('should append an item to the stack', () => {
                queue.enqueue({});

                expect(queue.isEmpty()).toBe(false);
            });
        });

        describe('dequeue()', () => {
            test('should remove and return all items from the stack', () => {
                const item1: any = { foo: 'bar' };
                const item2: any = { baz: 'qux' };

                queue.enqueue(item1);
                queue.enqueue(item2);

                const stack = queue.dequeue();

                expect(queue.isEmpty()).toBe(true);
                expect(stack.length).toEqual(2);
                expect(stack[0]).toEqual(item1);
                expect(stack[1]).toEqual(item2);
            });
        });

        describe('upsertLast()', () => {
            test('should not upsert if the queue is empty', () => {
                queue.upsertLast({});

                expect(queue.isEmpty()).toBe(true);
            });

            test('should upsert the last item in the stack', () => {
                const upsertItem = { baz: 'qux' };
                queue.enqueue({ foo: 'bar' });

                queue.upsertLast(upsertItem);


                const stack = queue.dequeue();

                expect(stack.length).toEqual(1);
                expect(stack[0]).toEqual(upsertItem);
            });
        });

        describe('peekLast()', () => {
            test('should return undefined if the stack is empty', () => {
                const inLastItem = queue.peekLast();

                expect(inLastItem).toBe(undefined);
            });

            test('should return the last item in the stack', () => {
                const item1 = { foo: 'bar' };
                const item2 = { baz: 'qux' };

                queue.enqueue(item1);
                queue.enqueue(item2);

                expect(queue.peekLast()).toEqual(item2);
            });
        });
    });

    describe('Queue with maxItems', () => {
        let queue: Queue;

        beforeEach(() => {
            queue = new Queue(2);
        });

        describe('enqueue()', () => {
            test('should append an item and remove the first one', () => {
                queue.enqueue('i1');
                queue.enqueue('i2');
                queue.enqueue('i3');

                const stack = queue.dequeue();

                expect(stack.length).toEqual(2);
                expect(stack[0]).toEqual('i2');
                expect(stack[1]).toEqual('i3');
            });
        });
    });
});
