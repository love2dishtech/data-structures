import { Stack } from "./Stack"
describe("Stack Operations", () => {

    test("size returns 0 after construction", () => {
        const st = new Stack()
        expect(st.isEmpty()).toBeTruthy()
    })

    test("push adds an element to the front of the stack", () => {
        const st = new Stack()
        st.push(1)
        expect(st.size()).toBe(1)
    })

    test("peek finds the 1st pushed value to stack", () => {
        const st = new Stack()
        st.push(1)
        st.push(20)
        expect(st.size()).toBe(2)
        expect(st.peek()).toBe(20)
    })

    test("pop removes the 1st element from the stack", () => {
        const st = new Stack()
        st.push(20)
        st.push(40)
        expect(st.size()).toBe(2)
        expect(st.pop()).toBe(40)
        expect(st.size()).toBe(1)
    })

    test("removes all the elements from the stack on multiple calls", () => {
        const st = new Stack()
        st.push(20)
        st.push(10)
        expect(st.isEmpty()).toBeFalsy()
        st.pop()
        st.pop()
        expect(st.isEmpty()).toBeTruthy()
    })

    test("fails when pop empty stack", () => {
        const st = new Stack()
        st.push(1)
        st.pop()
        expect(() => st.pop()).toThrowError()
    })

    test("fails when peeking empty stack", () => {
        const st = new Stack()
        st.push(1)
        st.pop()
        expect(() => st.peek()).toThrowError()
    })

    test("validates the peek/pop work respectively", () => {
        const st = new Stack()
        st.push(10)
        expect(st.peek()).toBe(10)
        st.push(20)
        expect(st.peek()).toBe(20)
        expect(st.pop()).toBe(20)
        expect(st.pop()).toBe(10)
    })
})