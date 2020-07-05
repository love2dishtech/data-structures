/**
 * This class is an implementation of the Union Find Data Structure that allows to create a disjoint set. Operations that are allowed in this
 * data structure include the union and the find operation.
 * 
 * Inspired and Inherited from the WilliamFiset Data Structures.
 * 
 * @author Love Hasija, love2dishtech@gmail.com
 */
export class UnionFind {

    private id: number[]
    private componentLength: number[]
    private numNodes: number
    private numComponents: number

    constructor(size: number) {
        if (size <= 0) throw new Error("Size should be greater than 0.")

        // Initilize all the nodes/elements as part of individual components
        this.numNodes = size
        this.numComponents = size

        // Initialize all the ids to be pointing to themselves as self loop
        this.id = Array.from({ length: size }, (_, i) => i)

        // Initialize all the nodes as a component itself with just 1 node.
        this.componentLength = Array.from({ length: size }, (_, i) => 1)
    }

    /**
     * Finds the node in the set of all the components/sets that exists. 
     * Returns the group name/component name in which the node exists.
     * 
     * Takes amortized constant time (Use path compression technique)
     * 
     * @param node 
     */
    public find(node: number): number {

        if (node < 0) throw new Error("Node must be >= 0")

        // Keep on iterating from the node to the parent nodes till we reach a root.
        // A root is a node which has a self loop, i.e. it points to itself.
        let root = this.id[node]
        while (root !== this.id[root]) root = this.id[root]

        this.compressPaths(node, root)
        return root;
    }

    /**
     * Compress the path from the given node `node` to the root object `root`.
     * The path compression compresses all the nodes from the node to the root.
     * 
     * This operation allows to have amortized time
     * 
     * @param node 
     * @param root 
     */
    private compressPaths(node: number, root: number) {
        let parent = this.id[node]
        this.id[node] = root
        while (parent !== node) {
            node = parent
            parent = this.id[node]
            this.id[node] = root
        }
    }

    /**
     * Unifies the 2 nodes provided as arguments. Figure out the components into which the nodes
     * belongs to and merges the 2 components if required.
     * @param nodeOne 
     * @param nodeTwo 
     */
    public unify(nodeOne: number, nodeTwo: number): number {

        if (nodeOne < 0 || nodeTwo < 0) throw new Error("Node must be >= 0")

        const parentOne = this.find(nodeOne)
        const parentTwo = this.find(nodeTwo)

        // Since the parents of both nodes are same, they are already merged and we can return either's parent.
        if (parentOne === parentTwo) {
            return this.find(nodeOne)
        }

        // Lets pick the parent root of the node which has the more elements.
        // We will use this node as the new parent for the other node.
        let mergedRoot
        if (this.componentLength[parentOne] > this.componentLength[parentTwo]) {
            this.id[parentTwo] = parentOne
            mergedRoot = parentOne
        } else {
            this.id[parentOne] = parentTwo
            mergedRoot = parentTwo
        }

        this.componentLength[mergedRoot] = this.componentLength[parentTwo] + this.componentLength[parentOne]
        this.numComponents--
        return mergedRoot
    }


    /**
     * Returns the size of the disjoint set.
     * It returns the number of nodes irrespective of the number of components
     */
    public size(): number {
        return this.numNodes
    }

    /**
     * Returns the number of components in the disjoint graph.
     */
    public components(): number {
        return this.numComponents
    }

    /**
     * Returns the number of nodes in a given component.
     * 
     * @param node 
     */
    public componentSize(node: number) {
        return this.componentLength[this.find(node)]
    }

    /**
     * Returns `true` if the 2 given nodes belong to the same component.
     * 
     * @param nodeOne 
     * @param nodeTwo 
     */
    public connected(nodeOne: number, nodeTwo: number) {
        return this.find(nodeOne) === this.find(nodeTwo)
    }
}