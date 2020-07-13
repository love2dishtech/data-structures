/**
 * A min priority queue implementation using binary heap.
 * 
 * Inspired and Inherited from William Fiset.
 * 
 * *Note:* We are going to use an array with a fixed capacity and double the capacity when required.
 * This is because of the performance optimization of using a fixed C Array if the array capacity is predefined.
 * It provides us an amortized capacity of O(1) and is much more faster as compared to the standard push operation
 * since it creates a hashtable underneath, not an array.
 * 
 * https://stackoverflow.com/questions/16961838/working-with-arrays-in-v8-performance-issue
 * 
 * @author `Love Hasija, love2dishtech@gmail.com`
 */
export class BinaryHeap<T> {

    /**
     * Internal heap storage used as a dynamic array. In programming languages like Java, we might have to use a linked list
     * or an array with an expandable capacity option.
     */
    private heap: T[]

    /**
     * Current capacity of the internal storage. Rather than relying on the dictionary mode of arrays that allows  * arrays to be grown to any size
     * dynamically, we rely on the fixed C type arrays.
     */
    private heapCapacity: number;

    /**
     * Current size of the heap, not the internal capacity.
     */
    private heapSize: number;

    /**
     * Default capacity of the internal heap storage.
     */
    private DEFAULT_CAPACITY = 64

    constructor(elements?: T[]) {
        if (elements === undefined) {
            this.heap = new Array(this.DEFAULT_CAPACITY)
            this.heapCapacity = this.DEFAULT_CAPACITY
            this.heapSize = 0
        } else {
            this.heap = new Array(elements.length)
            elements.forEach((elem, idx) => {
                this.heap[idx] = elem
            })
            this.heapCapacity = elements.length
            this.heapSize = elements.length
            this.heapify()
        }
    }

    /**
     * Heapify the current internal heap storage to a heap. This operation is much faster O(log n) as comapred to * * manually adding each
     * element to the array, which does a bubble operation at each step leading to O(n log n).
     * 
     * Takes O(n) amortized time for constructing the heap from the array.
     * 
     * http://www.cs.umd.edu/~meesh/351/mount/lectures/lect14-heapsort-analysis-part.pdf
     */
    private heapify() {
        for (let i = Math.max(0, Math.floor(this.heapSize / 2)); i >= 0; i--) {
            this.bubbleDown(i)
        }
    }

    /**
     * Finds and returns the minimum element from the priority queue.
     * 
     * Operates in the O(1) time.
     */
    public peek(): T {
        if (this.isEmpty()) throw new Error(`Heap is already empty, cannot return`)
        return this.heap[0]
    }

    /**
     * Return and remove the minimum elemnt from the priorty queue.
     * 
     * Operates in O(log n) time.
     */
    public poll() {
        // Validate the error conditions.
        if (this.isEmpty()) throw new Error(`Heap is already empty, cannot poll.`)

        // Return the top element.
        const data = this.heap[0]

        // Resize the heap and Reorder.
        this.swap(0, this.heapSize - 1)
        this.heapSize--
        this.bubbleDown(0)

        return data
    }

    /**
     * Adds a new element to the priority queue.
     * 
     * Operates in O(1) time.
     */
    public add(element: T) {
        this.heap[this.heapSize] = element;
        this.bubbleUp(this.heapSize)
        this.heapSize++
        if (this.heapCapacity === this.heapSize) this.increaseHeapCapacity()
    }

    /**
     * Bubbles down or Sink operation.
     * Takes a given position in the heap and places the element in the correct position from the node downwards.
     * 
     * @param idx 
     */
    private bubbleDown(idx: number) {
        while (idx < this.heapSize) {
            const leftChild = idx * 2 + 1
            const rightChild = idx * 2 + 2
            if (rightChild < this.heapSize && this.less(rightChild, leftChild) && this.less(rightChild, idx)) {
                this.swap(rightChild, idx)
                idx = rightChild
            } else if (leftChild < this.heapSize && this.less(leftChild, idx)) {
                this.swap(leftChild, idx)
                idx = leftChild
            } else {
                break
            }
        }
    }

    /**
     * Compare the left and the right index. Returns `true` if the left index is smaller.
     * 
     * @param left 
     * @param right 
     */
    private less(left: number, right: number): boolean {
        return this.heap[left] < this.heap[right]
    }

    /**
     * Bubble Up or the Swim operation.
     * Takes a given position in the heap and places the element in the correct position from the node upwards.
     * 
     * @param idx 
     */
    private bubbleUp(idx: number) {
        while (idx !== 0) {
            const parentIdx = Math.floor((idx - 1) / 2)
            if (this.less(idx, parentIdx)) {
                this.swap(idx, parentIdx)
                idx = parentIdx
            } else {
                break
            }
        }
    }

    /**
     * Swaps the elements at the source and dest positions.
     * 
     * @param source 
     * @param dest 
     */
    private swap(source: number, dest: number) {

        // Swap the actual elements in the heap.
        const temp = this.heap[source]
        this.heap[source] = this.heap[dest]
        this.heap[dest] = temp
    }

    /**
     * Doubling the capacity of the internal heap storage.
     * This is done to ensure that with capacity less then 99999, we use fixed C Arrays for faster performance.
     * It will provide a much better performance given that the capacity increase is rare. Same approach is used at other places like dictionary.
     */
    private increaseHeapCapacity() {
        this.heapCapacity = this.heapCapacity * 2
        const newHeap = new Array(this.heapCapacity)
        this.heap.forEach((elem, idx) => newHeap[idx] = elem)
        this.heap = newHeap
    }

    /**
     * Remove all the elements from the priority queue.
     * 
     */
    public clear() {
        // Setting heap size to 0 is enough to clear the contents since other operations will check it.
        this.heapSize = 0
    }

    /**
     * Returns the size of the priority queue.
     * 
     */
    public size() {
        return this.heapSize;
    }

    /**
     * Returns `true` if the priority queue is empty.
     * 
     */
    public isEmpty() {
        return this.heapSize === 0
    }

    /**
     * Returns `true` if the given element in found in the priority queue.
     * 
     */
    public contains(element: T) {
        return this.containsLinearScan(element)
    }

    /**
     * Removes the element from the binary heap.
     * 
     * @param element 
     */
    public remove(element: T): T {
        const nodeIdx = this.find(element)
        if (nodeIdx === -1) throw new Error(`Cannot remove the element, does not exists.`)
        return this.remoteAt(nodeIdx)
    }

    /**
     * Removes the node at the given index in the binary heap.
     * 
     * @param idx 
     */
    private remoteAt(idx: number): T {
        // Extracting the data before deletion.
        const data = this.heap[idx]

        // Deleting the element and swapping with last element for bubbling operations. 
        this.swap(idx, this.heapSize - 1)
        this.heapSize--

        // Reorder the heap.
        this.bubbleUp(idx)
        this.bubbleDown(idx)

        return data
    }

    /**
     * Find and returns the element index position.
     * 
     * @param element 
     */
    private find(element: T) {
        for (let i = 0; i < this.heapSize; i++) {
            if (element === this.heap[i])
                return i
        }
        return -1;
    }

    /**
        * Linear scan of the heap internal storage.
        */
    private containsLinearScan(element: T) {
        const idx = this.find(element)
        return idx >= 0
    }
}