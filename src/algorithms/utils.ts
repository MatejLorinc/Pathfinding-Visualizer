import Node, {NodeType, PathNodeType} from "../ui/grid/Node";
import {Neighbor, WEIGHT} from "../utils/settings";
import Grid from "../ui/grid/Grid";
import findDijkstra from "./dijkstra";
import findAStar from "./aStar";
import findBreadthFirst from "./breadthFirst";
import findDepthFirst from "./depthFirst";
import {getColumn, getRow} from "../utils/utils";

export interface VisitedNode {
    from: VisitedNode | undefined,
    node: Node
}

export const reconstructPath = (finishNode: VisitedNode) => {
    const path: Node[] = [];
    let fromNode: VisitedNode | undefined = finishNode;
    while (fromNode !== undefined) {
        path.unshift(fromNode.node);
        fromNode = fromNode.from;
    }
    return path;
};
export const getNeighbors = (grid: Grid, node: Node, enabledColumn: Neighbor[]) => {
    const nodes = grid.nodesRef.current;
    const nodeId = node.props.id;
    const nodeRow = getRow(nodeId, grid.props.columns);
    const nodeColumn = getColumn(nodeId, grid.props.columns);

    if (nodes === null) {
        return [];
    }

    return enabledColumn
        .map((item) => {
            return {
                id: item.getItemId(nodeRow, nodeColumn, grid.props.rows, grid.props.columns),
                diagonal: item.isDiagonal,
            };
        })
        .filter(({id}) => id != -1)
        .map(({id, diagonal}) => {
            return {
                node: nodes[id],
                diagonal,
            };
        });
};
export const getNodeWeight = (node: Node, isDiagonal = false) => {
    return (isDiagonal ? Math.SQRT2 : 1) * (node.state.nodeType === NodeType.WEIGHT ? WEIGHT : 1);
};
export const findNodes = (nodes: Node[], nodeType: NodeType) => {
    return nodes.filter((node) => node.state.nodeType == nodeType);
};
export const visualizePathFind = (algorithm: Generator<Node, Node[] | null>, delay: number, pathDelay = delay, skip: { current: boolean } = {current: false}) => {
    const animateVisit = delay > 0;
    const animatePath = pathDelay > 0;

    return new Promise((resolve, reject) => {
        const visitNode = (callback: () => void) => {
            const state = algorithm.next();

            if (state.done) {
                if (state.value === null) return;

                const pathIterator = state.value.entries();

                const createPath = (callback: () => void) => {
                    const nodeState = pathIterator.next();

                    if (nodeState.done) {
                        callback();
                        resolve("Pathfinding has finished");
                        return;
                    }

                    nodeState.value[1].setPathType(PathNodeType.PATH, (animatePath && !skip.current));

                    if (skip.current) {
                        createPath(callback);
                        return;
                    }
                };

                if (pathDelay > 0) {
                    const pathInterval: NodeJS.Timer = setInterval(() => createPath(() => clearInterval(pathInterval)), pathDelay);
                } else {
                    let done = false;
                    while (!done) {
                        createPath(() => done = true);
                    }
                }

                callback();
                return;
            }
            state.value.setPathType(PathNodeType.VISITED, (animateVisit && !skip.current));

            if (skip.current) {
                visitNode(callback);
                return;
            }
        };

        if (delay > 0) {
            const visitedNodesInterval: NodeJS.Timer = setInterval(() => visitNode(() => clearInterval(visitedNodesInterval)), delay);
        } else {
            let done = false;
            while (!done) {
                visitNode(() => done = true);
            }
        }

    });
};

export const findPath = (algorithm: string, grid: Grid, enabledNeighbors: Neighbor[]) => {
    switch (algorithm.toLowerCase()) {
        case "dijkstra":
            return findDijkstra(grid, enabledNeighbors);
        case "astar":
            return findAStar(grid, enabledNeighbors);
        case "bfs":
            return findBreadthFirst(grid, enabledNeighbors);
        case "dfs":
            return findDepthFirst(grid, enabledNeighbors);
        default:
            return findAStar(grid, enabledNeighbors);
    }
};