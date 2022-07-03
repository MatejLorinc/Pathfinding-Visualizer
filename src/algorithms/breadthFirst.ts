import Grid from "../ui/grid/Grid";
import {Neighbor} from "../utils/settings";
import Queue from "./data-structures/queue";
import {findNodes, getNeighbors, reconstructPath, VisitedNode} from "./utils";
import Node, {NodeType} from "../ui/grid/Node";

export default function* findPath(grid: Grid, enabledNeighbors: Neighbor[]) {
    if (grid.nodesRef.current === null) return null;

    const startNode = findNodes(grid.nodesRef.current, NodeType.START)[0];

    const nodes: VisitedNode[] = grid.nodesRef.current.map((node) => {
        return {from: undefined, node};
    });

    const unvisitedNodes = new Queue<number>;
    unvisitedNodes.enqueue(startNode.props.id);

    const visitedNodes: Node[] = [];

    while (unvisitedNodes.elements.length > 0) {
        const current = nodes[unvisitedNodes.dequeue()];

        getNeighbors(grid, current.node, enabledNeighbors).forEach(({node: neighborNode}) => {
            if (neighborNode.state.nodeType === NodeType.WALL) return;
            if (visitedNodes.includes(neighborNode)) return;
            if (unvisitedNodes.elements.includes(neighborNode.props.id)) return;

            unvisitedNodes.enqueue(neighborNode.props.id);
            nodes[neighborNode.props.id] = {from: current, node: neighborNode};
        });

        visitedNodes.push(current.node);
        yield current.node;

        if (current.node.state.nodeType === NodeType.FINISH) {
            return reconstructPath(current);
        }
    }
    return [];
}