import { BinaryHeapQuickRemovals as BinaryHeap } from "./BinaryHeapQuickRemovals"

describe("Binary Heap", () => {
    test("Creates a heap with 0 elements with no added elements.", () => {
        const heap = new BinaryHeap()
        expect(heap.size()).toBe(0)
        expect(heap.isEmpty()).toBeTruthy()
    })

    test("Creates a heap with all the elements as requested,", () => {
        const heap = new BinaryHeap([1, 2, 3, 4, 5])
        expect(heap.size()).toBe(5)
        expect(heap.isEmpty()).toBeFalsy()
    })

    test("Poll returns and removes the elements in the min order.", () => {
        const heap = new BinaryHeap([5, 2, 1, 4, 3])
        expect(heap.poll()).toBe(1)
        expect(heap.poll()).toBe(2)
        expect(heap.poll()).toBe(3)
        expect(heap.poll()).toBe(4)
        expect(heap.poll()).toBe(5)
    })

    test("Poll returns exception if there is a poll request with no elements", () => {
        const heap = new BinaryHeap()
        expect(() => heap.poll()).toThrowError()
    })

    test("Peek returns the min element in a heap", () => {
        const heap = new BinaryHeap([4, 2, 3, 1, 3])
        expect(heap.peek()).toBe(1)
        expect(heap.peek()).toBe(1)
    })

    test("Peek throws an exception upon retrieval from empty heap", () => {
        const heap = new BinaryHeap()
        expect(() => heap.peek()).toThrowError()
    })

    test("Contains returns true if the element exists in the heap", () => {
        const heap = new BinaryHeap([4, 2, 1, 3, 5])
        expect(heap.contains(1)).toBeTruthy()
    })

    test("Contains returns false if an element is not present in the heap.", () => {
        const heap = new BinaryHeap([1, 4, 6, 4])
        expect(heap.contains(21)).toBeFalsy()
    })

    test("Adds adds an element to the heap", () => {
        const heap = new BinaryHeap()
        expect(heap.size()).toBe(0)
        heap.add(2)
        expect(heap.size()).toBe(1)
        heap.add(3)
        expect(heap.size()).toBe(2)
    })

    test("Add adds the element in the order of min heap", () => {
        const heap = new BinaryHeap()
        heap.add(5)
        heap.add(1)
        heap.add(2)
        expect(heap.peek()).toBe(1)
        expect(heap.poll()).toBe(1)
        expect(heap.poll()).toBe(2)
        expect(heap.poll()).toBe(5)
    })

    test("Clear removes all the elements from the heap", () => {
        const heap = new BinaryHeap([2, 324, 324, 1, 2, 41])
        expect(heap.size()).toBe(6)
        heap.clear()
        expect(heap.size()).toBe(0)
        expect(heap.isEmpty()).toBeTruthy()
    })

    test("Heap exhaustively work with all the operations", () => {
        const heap = new BinaryHeap()
        expect(heap.isEmpty()).toBeTruthy()
        expect(heap.size()).toBe(0)
        heap.add(30)
        expect(heap.size()).toBe(1)
        expect(heap.peek()).toBe(30)
        heap.add(10)
        expect(heap.size()).toBe(2)
        expect(heap.peek()).toBe(10)
        heap.add(20)
        expect(heap.size()).toBe(3)
        expect(heap.contains(10)).toBeTruthy()
        expect(heap.contains(20)).toBeTruthy()
        expect(heap.contains(30)).toBeTruthy()
        expect(heap.contains(40)).toBeFalsy()
        heap.add(40)
        expect(heap.size()).toBe(4)
        expect(heap.contains(40)).toBeTruthy()
        expect(heap.size()).toBe(4)
        expect(heap.poll()).toBe(10)
        expect(heap.size()).toBe(3)
        expect(heap.poll()).toBe(20)
        expect(heap.size()).toBe(2)
        expect(heap.poll()).toBe(30)
        expect(heap.size()).toBe(1)
        expect(heap.poll()).toBe(40)
        expect(heap.size()).toBe(0)
        expect(heap.isEmpty()).toBeTruthy()
    })

    test("doubles the default capacity when size is exhausted", () => {
        const heap = new BinaryHeap()
        for (let i = 0; i < 63; i++) {
            heap.add(1)
        }
        expect(heap.size()).toBe(63)
        heap.add(1)
        heap.add(1)
        heap.add(1)
        expect(heap.size()).toBe(66)
    })

    test("removes the element if present", () => {
        const heap = new BinaryHeap([3, 4, 1, 5, 31])
        expect(heap.remove(1)).toBe(1)
    })

    test("removes throws error when removing a node which does not exists", () => {
        const heap = new BinaryHeap([1, 4, 2, 4, 6])
        expect(() => heap.remove(9)).toThrowError()
    })

    test("remove retains the integrity of the heap", () => {
        const heap = new BinaryHeap([4, 1, 3, 2, 5])
        expect(heap.contains(3)).toBeTruthy()
        expect(heap.size()).toBe(5)
        heap.remove(3)
        expect(heap.contains(3)).toBeFalsy()
        expect(heap.size()).toBe(4)
        expect(heap.peek()).toBe(1)
        expect(heap.contains(1)).toBeTruthy()
        heap.remove(1)
        expect(heap.size()).toBe(3)
        expect(heap.contains(1)).toBeFalsy()
        expect(heap.peek()).toBe(2)
        expect(heap.contains(2)).toBeTruthy()
        heap.remove(2)
        expect(heap.size()).toBe(2)
        expect(heap.contains(2)).toBeFalsy()
        expect(heap.peek()).toBe(4)
        expect(heap.contains(4)).toBeTruthy()
        heap.remove(4)
        expect(heap.size()).toBe(1)
        expect(heap.contains(4)).toBeFalsy()
        expect(heap.peek()).toBe(5)
        expect(heap.contains(5)).toBeTruthy()
        heap.remove(5)
        expect(heap.size()).toBe(0)
        expect(heap.contains(5)).toBeFalsy()
        expect(() => heap.peek()).toThrowError()
    })

    test("remove works well when adding elements dynamically", () => {
        const heap = new BinaryHeap()
        heap.add(31)
        expect(heap.remove(31)).toBe(31)
        heap.add(12)
        heap.add(32)
        heap.add(3)
        expect(() => heap.remove(1)).toThrowError()
        expect(heap.remove(12)).toBe(12)
        expect(heap.remove(32)).toBe(32)
        expect(heap.remove(3)).toBe(3)
    })
});