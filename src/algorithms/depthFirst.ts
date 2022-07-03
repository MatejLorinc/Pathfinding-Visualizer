import Grid from "../ui/grid/Grid";
import {Neighbor} from "../utils/settings";
import {findNodes, getNeighbors, reconstructPath, VisitedNode} from "./utils";
import Node, {NodeType} from "../ui/grid/Node";

export default function* findPath(grid: Grid, enabledNeighbors: Neighbor[]) {
    if (grid.nodesRef.current === null) return null;

    const startNode = findNodes(grid.nodesRef.current, NodeType.START)[0];

    const nodes: VisitedNode[] = grid.nodesRef.current.map((node) => {
        return {from: undefined, node};
    });

    const unvisitedNodes: number[] = [];
    unvisitedNodes.push(startNode.props.id);

    const visitedNodes: Node[] = [];

    while (unvisitedNodes.length > 0) {
        const current = nodes[unvisitedNodes.pop() as number];
        if (visitedNodes.includes(current.node)) continue;

        getNeighbors(grid, current.node, enabledNeighbors).forEach(({node: neighborNode}) => {
            if (neighborNode.state.nodeType === NodeType.WALL) return;
            if (visitedNodes.includes(neighborNode)) return;

            unvisitedNodes.push(neighborNode.props.id);
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