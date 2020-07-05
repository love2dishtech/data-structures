import { UnionFind } from "./UnionFind"
import { exec } from "child_process"
import { assert } from "console"

test("Union Find constructs correctly", () => {
    const uf = new UnionFind(5)
    expect(uf.components()).toBe(5)
    expect(uf.size()).toBe(5)
    expect(uf.componentSize(0)).toBe(1)
    expect(uf.componentSize(1)).toBe(1)
    expect(uf.componentSize(2)).toBe(1)
    expect(uf.componentSize(3)).toBe(1)
    expect(uf.componentSize(4)).toBe(1)
})

test("Union find finds the nodes as self loop without union", () => {
    const uf = new UnionFind(5)
    expect(uf.find(0)).toBe(0)
    expect(uf.find(1)).toBe(1)
    expect(uf.find(2)).toBe(2)
    expect(uf.find(3)).toBe(3)
    expect(uf.find(4)).toBe(4)
})

test("Union-Find unifies and finds correctly", () => {
    const uf = new UnionFind(10)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(10)
    expect(uf.componentSize(0)).toBe(1)
    expect(uf.componentSize(1)).toBe(1)

    uf.unify(0, 1)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(9)
    expect(uf.componentSize(0)).toBe(2)
    expect(uf.find(0)).toBe(1)
    expect(uf.find(1)).toBe(1)

    uf.unify(2, 3)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(8)
    expect(uf.componentSize(0)).toBe(2)
    expect(uf.componentSize(2)).toBe(2)
    expect(uf.componentSize(3)).toBe(2)
    expect(uf.find(2)).toBe(3)
    expect(uf.find(3)).toBe(3)

    uf.unify(0, 2)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(7)
    expect(uf.componentSize(0)).toBe(4)
    expect(uf.componentSize(2)).toBe(4)
    expect(uf.componentSize(3)).toBe(4)
    expect(uf.componentSize(1)).toBe(4)
    expect(uf.find(2)).toBe(3)
    expect(uf.find(3)).toBe(3)

    uf.unify(6, 7)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(6)
    expect(uf.componentSize(6)).toBe(2)
    expect(uf.componentSize(7)).toBe(2)
    expect(uf.find(6)).toBe(7)
    expect(uf.find(7)).toBe(7)

    uf.unify(0, 7)
    expect(uf.size()).toBe(10)
    expect(uf.components()).toBe(5)
    expect(uf.componentSize(6)).toBe(6)
    expect(uf.componentSize(7)).toBe(6)
    expect(uf.componentSize(0)).toBe(6)
    expect(uf.componentSize(1)).toBe(6)
    expect(uf.componentSize(2)).toBe(6)
    expect(uf.componentSize(3)).toBe(6)
    expect(uf.find(6)).toBe(3)
    expect(uf.find(7)).toBe(3)
    expect(uf.find(0)).toBe(3)
    expect(uf.find(1)).toBe(3)
    expect(uf.find(2)).toBe(3)
    expect(uf.find(3)).toBe(3)
})

test("Union-Find correctly validates the connectivity", () => {
    const uf = new UnionFind(5)
    expect(uf.connected(0, 1)).toBe(false)
    expect(uf.connected(0, 2)).toBe(false)
    expect(uf.connected(0, 3)).toBe(false)
    expect(uf.connected(1, 4)).toBe(false)
    expect(uf.connected(1, 2)).toBe(false)

    uf.unify(0, 1)
    expect(uf.connected(0, 1)).toBe(true)
    expect(uf.connected(0, 2)).toBe(false)
    expect(uf.connected(0, 3)).toBe(false)
    expect(uf.connected(1, 4)).toBe(false)
    expect(uf.connected(1, 2)).toBe(false)

    uf.unify(3, 4)
    expect(uf.connected(0, 1)).toBe(true)
    expect(uf.connected(0, 2)).toBe(false)
    expect(uf.connected(0, 3)).toBe(false)
    expect(uf.connected(1, 4)).toBe(false)
    expect(uf.connected(1, 2)).toBe(false)
    expect(uf.connected(3, 4)).toBe(true)

    uf.unify(1, 4)
    expect(uf.connected(0, 1)).toBe(true)
    expect(uf.connected(0, 3)).toBe(true)
    expect(uf.connected(1, 4)).toBe(true)
    expect(uf.connected(1, 3)).toBe(true)
    expect(uf.connected(1, 2)).toBe(false)

    uf.unify(2, 4)
    for(let i=0;i<5;i++) {
        for(let j=0;j<5;j++) {
            expect(uf.connected(i, j)).toBe(true)
        }
    }
})

test("Size is maintined at all times", () => {
    const uf = new UnionFind(5)
    expect(uf.size()).toBe(5)

    uf.unify(1, 2)
    uf.find(2)
    expect(uf.size()).toBe(5)

    uf.unify(5, 2)
    uf.find(3)
    expect(uf.size()).toBe(5)

    uf.unify(1, 4)
    uf.find(4)
    expect(uf.size()).toBe(5)
})

test("Validates the input on the find operation", () => {
    const uf = new UnionFind(5)
    expect(() => uf.find(-1)).toThrow()
})

test("Validates the input on the unify operation", () => {
    const uf = new UnionFind(5)
    expect(() => uf.unify(-1, -31)).toThrow()
})