import Node, {NodeType} from "../ui/grid/Node";
import MinHeap from "./data-structures/heap";
import Grid from "../ui/grid/Grid";
import {Neighbor} from "../utils/settings";
import {findNodes, getNeighbors, getNodeWeight, reconstructPath} from "./utils";
import {getColumn, getRow} from "../utils/utils";

export default function* findPath(grid: Grid, enabledNeighbors: Neighbor[]) {
    if (grid.nodesRef.current === null) return null;

    interface DistanceNode {
        h: number,
        g: number,
        id: number
    }

    interface VisitedNode {
        h: number,
        g: number,
        from: VisitedNode | undefined,
        node: Node
    }

    const startNode = findNodes(grid.nodesRef.current, NodeType.START)[0];
    const endNode = findNodes(grid.nodesRef.current, NodeType.FINISH)[0];

    const nodes: VisitedNode[] = grid.nodesRef.current.map((node) => {
        return {h: Infinity, g: Infinity, from: undefined, node};
    });
    const unvisitedNodes = new MinHeap<DistanceNode>((nodeA, nodeB) => {
        const aF = nodeA.g + nodeA.h;
        const bF = nodeB.g + nodeB.h;

        if (aF === bF) {
            return nodeA.h - nodeB.h;
        } else {
            return aF - bF;
        }
    });
    const visitedNodes: Node[] = [];

    nodes[startNode.props.id] = {
        h: getManhattanDistance(startNode, endNode, grid),
        g: 0,
        from: undefined,
        node: startNode,
    };
    unvisitedNodes.add({h: getManhattanDistance(startNode, endNode, grid), g: 0, id: startNode.props.id});

    while (unvisitedNodes.heap.length > 0) {
        const closestNode = nodes[unvisitedNodes.shift().id];

        getNeighbors(grid, closestNode.node, enabledNeighbors).forEach(({node: neighborNode, diagonal}) => {
            if (neighborNode.state.nodeType === NodeType.WALL) return;
            if (visitedNodes.includes(neighborNode)) return;

            const neighborId = neighborNode.props.id;
            const oldH = nodes[neighborId].h;
            const oldG = nodes[neighborId].g;
            const oldF = oldH + oldG;
            const h = getManhattanDistance(neighborNode, endNode, grid);
            const g = closestNode.g + getNodeWeight(neighborNode, diagonal);
            const f = h + g;

            if (f < oldF) {
                const old = unvisitedNodes.find({
                    h: oldH,
                    g: oldG,
                    id: neighborNode.props.id
                }, (node) => node.id === neighborId);

                if (old === null) {
                    unvisitedNodes.add({h, g, id: neighborId});
                } else if (f < oldF) {
                    unvisitedNodes.decrease(old.index, {h, g, id: neighborId});
                } else {
                    return;
                }

                nodes[neighborId] = {h, g, from: closestNode, node: neighborNode};
            }
        });

        visitedNodes.push(closestNode.node);
        yield closestNode.node;

        if (closestNode.node.state.nodeType === NodeType.FINISH) {
            return reconstructPath(closestNode);
        }
    }
    return [];
}

const getManhattanDistance = (start: Node, end: Node, grid: Grid) => {
    const startRow = getRow(start.props.id, grid.props.columns),
        startColumn = getColumn(start.props.id, grid.props.columns);
    const endRow = getRow(end.props.id, grid.props.columns), endColumn = getColumn(end.props.id, grid.props.columns);

    const yDiff = Math.abs(startRow - endRow);
    const xDiff = Math.abs(startColumn - endColumn);

    return yDiff + xDiff;
};
