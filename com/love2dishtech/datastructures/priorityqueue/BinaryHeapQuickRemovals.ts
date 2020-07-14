import { promisify } from "util";

/**
 * A min priority queue implementation using binary heap.
 * 
 * Inspired and Inherited from William Fiset.
 * 
 * *Note:* We are going to use an array with a fixed capacity and double the capacity when required.
 * This is because of the performance optimization of using a fixed C Array if the array capacity is predefined.
 * It provides us an amortized capacity of O(1) and is much more faster as compared to the standard push operation since
 * it creates a hashtable underneath, not an array.
 * 
 * Additionally uses a hashtbale underneath as an index for faster search, get, remove operations.
 * 
 * https://stackoverflow.com/questions/16961838/working-with-arrays-in-v8-performance-issue
 * 
 * @author `Love Hasija, love2dishtech@gmail.com`
 */
export class BinaryHeapQuickRemovals<T> {

    /**
     * Internal heap storage used as a dynamic array. In programming languages like Java, we might have to use a linked list
     * or an array with an expandable capacity option.
     */
    private heap: T[]

    /**
     * Internal Hash Table storage used for indexing the elements in the binary heap.
     * This provides O(1) find and contains operation as compared to linear scan - O(n).
     * 
     * Let's the overall performance of the remove operation to be O(log n) as comapred to O(n).
     * 
     * Uses O(n) more storage for additional indexes.
     * 
     */
    private heapIndex: Map<T, Set<number>> = new Map();

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
                this.addIndex(elem, idx)
            })
            this.heapCapacity = elements.length
            this.heapSize = elements.length
            this.heapify()
        }
    }

    /**
     * Adds the element with the respective position as the index.
     * 
     * @param element 
     * @param position 
     */
    private addIndex(element: T, position: number) {
        if (this.heapIndex.has(element)) {
            this.heapIndex.get(element)?.add(position)
        } else {
            this.heapIndex.set(element, new Set([position]))
        }
    }

    /**
     * Updates the index from old position to new position for the element.
     * 
     * @param element 
     * @param oldPos 
     * @param newPos 
     */
    private updateIndex(element: T, oldPos: number, newPos: number) {
        this.heapIndex.get(element)?.delete(oldPos)
        this.heapIndex.get(element)?.add(newPos)
    }

    /**
     * Removes the element from the index. O(1) operation.
     * 
     * @param element 
     * @param position 
     */
    private removeIndex(element: T, position: number) {
        this.heapIndex.get(element)?.delete(position)
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
        // Adds the new element to the end of the heap with index.
        this.heap[this.heapSize] = element;
        this.addIndex(element, this.heapSize)

        // Re-ordering the heap.
        this.bubbleUp(this.heapSize)

        // Returning the control, additionally increasing the capacity if required.
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

        // Swap the actual indexes in the heap.
        if (source < this.heapSize)
            this.updateIndex(this.heap[source], dest, source)
        if (dest < this.heapSize)
            this.updateIndex(this.heap[dest], source, dest)
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
        // return this.containsLinearScan(element)
        return this.containsHashTableScan(element)
    }

    /**
     * Removes the element from the binary heap.
     * 
     * Does the removal in O(log n) time given that the hash table index finds the element in O(1).
     * If the hashtable index is not available, it would have to do the linear scan leading to O(n)
     * 
     * @param element 
     */
    public remove(element: T) {
        // Finds the correct position of the element using the underlying index.
        const positions = this.find(element)
        if (positions === undefined || positions.size === 0)
            throw new Error(`Cannot remove node, it does not exists.`)
        const positionToDelete: number = positions.values().next().value

        // Delete the position from the index and the node.
        return this.removeAt(positionToDelete, element)
    }

    /**
     * Removes the element at the given position.
     * 
     * @param position 
     */
    private removeAt(position: number, element: T) {
        // Deleting the index
        this.removeIndex(element, position)

        // Swap the node with the last node and mark for deletion.
        this.heapSize--
        this.swap(position, this.heapSize)

        // Re-adjust the heap.
        this.bubbleDown(position)
        this.bubbleUp(position)

        return element
    }

    /**
     * Finds the element position in the heap.
     * 
     * @param element 
     */
    private find(element: T): Set<number> | undefined {
        return this.heapIndex.get(element)
    }

    private containsHashTableScan(element: T) {
        const positions = this.find(element)
        return positions !== undefined && positions.size > 0
    }
}