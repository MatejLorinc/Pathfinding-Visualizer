# Pathfinding Visualizer

### [Demo](https://1Math3w.github.io/Pathfinding-Visualizer)

Tool that shows how different pathfinding algorithms work.

### Used technologies

[![Used technologies](https://skillicons.dev/icons?i=ts,react,vite,materialui)](https://github.com/1Math3w)

## Algorithms

### Dijkstra

- Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph.
- Time complexity: O(E log V)
- Used data structure: min-heap

### A* search

- A* is one of the best technique used in path-finding and graph traversals.
- Time complexity: O(E)
- Used data structure: min-heap

### Breadth-first search

- BFS is unweighted search algorithm used to explore nodes and edges of a graph.
- Doesn't guarantee shortest path
- Time complexity: O(V+E)
- Used data structure: queue

### Depth-first search

- DFS is the most fundamental unweighted search algorithm used to explore nodes and edges of a graph.
- Doesn't guarantee shortest path
- Time complexity: O(V+E)
- Used data structure: array

## Visit order

- You can enable or disable some directions (diagonals are disabled by default).
- You can also choose the order of direction discovery.

## Walls & Weights

- Walls are impenetrable (path cannot cross through them).
- Weight nodes, however, are penetrable, but it is more difficult to move through them. In this visualizer, moving
  through a
  weight node is 5 times more difficult than moving through a classic node.