/**
 * The Stack data structure supporting operations for popping and pushing the elements
 * of the generic type. Also supports searching the element in the stack.
 * 
 * Uses Javascript array implementation underneath.
 * Inspired by WilliamFiset.
 * 
 * @author Love Hasija, love2dishtech@gmail.com
 */
export class Stack<T> {

    private elements: T[]

    /**
     * Constructs a stack with no elements.
     */
    constructor() {
        this.elements = []
    }

    /**
     * Push the new element to the back of the stack.
     * 
     * @param elem 
     */
    public push(elem: T): T {
        if (elem === undefined || elem === null) throw new Error("Element must be valid.")
        this.elements.push(elem)
        return elem
    }

    /**
     * Returns and removes the first element from the front of the stack.
     */
    public pop(): T {
        if (this.isEmpty()) throw new Error("Stack is already empty.")
        return this.elements.pop() as T;
    }

    /**
     * Returns `true` if the stack has no elements.
     */
    public isEmpty(): boolean {
        return this.elements.length === 0
    }

    /**
     * Returns the value of the first element in the front of the stack.
     */
    public peek(): T {
        if (this.isEmpty()) throw new Error("Stack already empty.")
        return this.elements[this.elements.length - 1]
    }

    /**
     * Returns the size of the stack.
     * 
     */
    public size(): number {
        return this.elements.length
    }
}