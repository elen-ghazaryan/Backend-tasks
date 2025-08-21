export class Graph {
    list = {}

    addVertex(v) {
        if(!this.list[v]) {
            this.list[v] = []
        }
    }

    addEdge(u,v,w) {
        this.addVertex(u)
        this.addVertex(v)

        this.list[u].push([v, w])
    }

    hasCycle() {
        const nodes = Object.keys(this.list)
        
        //initialize indegrees as 0
        const indegree = {}
        for(const node of nodes) {
            indegree[node] = 0;
        }

        //calculate indegree
        for(const u of nodes) {
            for(const [neighbor] of this.list[u]) {
                indegree[neighbor]++
            }
        }

        //in queue add all nodes with indegree 0
        const queue = []
        for(let node of nodes) {
            if(indegree[node] == 0) {
                queue.push(node)
            }
        }

        //core logic
        let count = 0;
        while(queue.length) {
            const vertex = queue.shift()
            count++;


            const neighbors = this.list[vertex]
            for(let [neighbor] of neighbors) {
                indegree[neighbor]--;
                if(indegree[neighbor] == 0) {
                    queue.push(neighbor)
                }
            }
        }

        return count !== nodes.length
    }


    shortestPath(u, v) {
        const costs = {}; //shortest known cost to each node
        let visited = new Set();
        const queue = new PrQueue();
        
        //initialize costs to Infinity
        for(let node of Object.keys(this.list)) {
            costs[node] = Infinity;
        }
        
        costs[u] = 0;
        queue.insert([u, 0])

        while(!queue.isEmpty()) {
            const [u, cost] = queue.extractMin()
            
            if(visited.has(u)) continue;
            visited.add(u)

            if(u == v) break;
        

            for(let [neighbor, weight] of this.list[u]) {
                const newCost = cost + weight;
                if(newCost < costs[neighbor]) {
                    costs[neighbor] = newCost;
                    queue.insert([neighbor, newCost])
                }
            }
        }

        return costs[v] === Infinity ? -1 : costs[v]
    }
}


class PrQueue {
    heap = []

    size() {
        return this.heap.length
    }

    swap(i,j) {
        ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
    }

    insert(value) {
        this.heap.push(value)
        this.heapifyUp(this.size() - 1)
    }

    extractMin() {
        if (this.size() === 0) return null;
        if(this.size() === 1) return this.heap.pop()
        this.swap(0, this.size() - 1)
        const min = this.heap.pop()

        this.heapifyDown(0)
        return min;
    }
    
    heapifyUp(index) {
        let i = index;
        while (i > 0) {
            let parent = Math.floor((i - 1) / 2);
            if (this.heap[i][1] < this.heap[parent][1]) {
                this.swap(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }


    heapifyDown(i) {
        while(i < this.size()) {
            let left = 2*i + 1;
            let right = 2*i + 2;
            let min = i

            if(left < this.size() && this.heap[left][1] < this.heap[min][1]) {
                min = left
            }
            if(right < this.size() && this.heap[right][1] < this.heap[min][1]) {
                min = right
            }

            if(i !== min) {
                this.swap(i, min)
                i = min;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        if(this.heap.length == 0) return true
        return false;
    }
}

