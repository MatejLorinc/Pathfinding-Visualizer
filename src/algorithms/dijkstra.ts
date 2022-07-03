import Node, {NodeType} from "../ui/grid/Node";
import MinHeap from "./data-structures/heap";
import Grid from "../ui/grid/Grid";
import {Neighbor} from "../utils/settings";
import {findNodes, getNeighbors, getNodeWeight, reconstructPath} from "./utils";

export default function* findPath(grid: Grid, enabledNeighbors: Neighbor[]) {
    if (grid.nodesRef.current === null) return null;

    interface DistanceNode {
        distance: number,
        id: number
    }

    interface VisitedNode {
        distance: number,
        from: VisitedNode | undefined,
        node: Node
    }

    const startNode = findNodes(grid.nodesRef.current, NodeType.START)[0];

    const nodes: VisitedNode[] = grid.nodesRef.current.map((node) => {
        return {distance: Infinity, from: undefined, node};
    });
    const unvisitedNodes = new MinHeap<DistanceNode>((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    const visitedNodes: Node[] = [];

    nodes[startNode.props.id] = {
        distance: 0,
        from: undefined,
        node: startNode,
    };
    unvisitedNodes.add({distance: 0, id: startNode.props.id});

    while (unvisitedNodes.heap.length > 0) {
        const closestNode = nodes[unvisitedNodes.shift().id];

        getNeighbors(grid, closestNode.node, enabledNeighbors).forEach(({node: neighborNode, diagonal}) => {
            if (neighborNode.state.nodeType === NodeType.WALL) return;
            if (visitedNodes.includes(neighborNode)) return;

            const neighborId = neighborNode.props.id;
            const oldDistance = nodes[neighborId].distance;
            const newDistance = closestNode.distance + getNodeWeight(neighborNode, diagonal);

            if (newDistance < oldDistance) {
                const old = unvisitedNodes.find({
                    distance: oldDistance,
                    id: neighborNode.props.id
                }, (node) => node.id === neighborId);

                if (old === null) {
                    unvisitedNodes.add({distance: newDistance, id: neighborId});
                } else if (newDistance < old.item.distance) {
                    unvisitedNodes.decrease(old.index, {distance: newDistance, id: neighborId});
                } else {
                    return;
                }

                nodes[neighborId] = {distance: newDistance, from: closestNode, node: neighborNode};
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
