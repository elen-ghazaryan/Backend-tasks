import { Graph } from "./graph.js";

let g = new Graph();

g.addEdge('A', 'B', 4);
g.addEdge('A', 'C', 2);
g.addEdge('B', 'C', 5);
g.addEdge('B', 'D', 10);
g.addEdge('C', 'E', 3);
g.addEdge('E', 'D', 4);
g.addEdge('D', 'F', 11);
g.addEdge('E', 'F', 5);

g.addEdge('F', 'B', 1);

console.log(g.hasCycle());   //true
console.log(g.shortestPath('A', 'F')); //10
console.log(g.shortestPath('C', 'F')); //8
console.log(g.shortestPath('E', 'B')); //16