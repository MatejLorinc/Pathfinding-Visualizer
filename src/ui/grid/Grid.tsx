import React, {Component, createRef} from "react";
import Node, {NodeType, NodeVariation} from "./Node.js";
import styled from "styled-components";
import {defaultRows, GRID_MARGIN, NODE_SIZE} from "../../utils/settings";
import {getId} from "../../utils/utils";

const GridContainer = styled.div<{ columns: number, rows: number }>`
  display: grid;
  white-space: nowrap;
  padding: 5px;
  grid-template-columns: repeat(${({columns}) => columns}, ${NODE_SIZE}px);
  grid-template-rows: repeat(${({rows}) => rows}, ${NODE_SIZE}px);
  overflow: auto;
  max-height: ${defaultRows * NODE_SIZE + GRID_MARGIN}px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #1a1a1a;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #666;
  }

  &::-webkit-scrollbar-corner {
    background-color: #1a1a1a;
  }
`;

interface GridProps {
    rows: number,
    columns: number,
    selectedRef: React.MutableRefObject<{ node: NodeType, [key: string]: any }>
    setGridCleared: React.Dispatch<React.SetStateAction<boolean>>;
}

export default class Grid extends Component<GridProps> {
    currentNode: React.MutableRefObject<Node | null>;
    nodesRef: React.MutableRefObject<Node[] | null>;

    defaultStartLocation: number;
    defaultFinishLocation: number;

    constructor(props: GridProps) {
        super(props);
        this.currentNode = createRef();
        this.nodesRef = createRef();
        this.nodesRef.current = [];

        this.defaultStartLocation = getId(Math.floor(this.props.rows / 2), 1, this.props.rows, this.props.columns);
        this.defaultFinishLocation = getId(Math.floor(this.props.rows / 2), this.props.columns - 2, this.props.rows, this.props.columns);

        this.props.setGridCleared(true);
    }

    resetNode = () => (this.currentNode.current = null);

    componentDidMount() {
        document.addEventListener("mouseup", this.resetNode);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.resetNode);
    }

    isCleared = () => {
        if (this.nodesRef.current === null) return true;

        for (let node of this.nodesRef.current) {
            if (node.state.pathType !== undefined) return false;
        }

        return true;
    };

    clearPath = () => {
        this.nodesRef.current?.forEach((node) => {
            node.setPathType(undefined, false);
        });
        this.props.setGridCleared(true);
    };

    clear = () => {
        this.nodesRef.current?.forEach((node) => {
            node.clear();
        });
        this.props.setGridCleared(true);
    };

    reset = () => {
        this.nodesRef.current?.forEach((node) => {
            node.reset();

            if (node.props.id === this.defaultStartLocation) node.setType(NodeType.START);
            else if (node.props.id === this.defaultFinishLocation) node.setType(NodeType.FINISH);
        });
        this.props.setGridCleared(true);
    };

    render() {
        const nodes = Array(this.props.rows * this.props.columns)
            .fill(null)
            .map((_, nodeIndex) => createNode(nodeIndex, this, this.props.selectedRef));

        return (
            <GridContainer
                onDragStart={(event) => event.preventDefault()}
                rows={this.props.rows}
                columns={this.props.columns}
            >
                {nodes}
            </GridContainer>
        );
    }
}

const createNode = (nodeIndex: number, grid: Grid, selectedRef: React.MutableRefObject<{ node: NodeType, [key: string]: any }>) => {
    return (
        <Node
            key={nodeIndex}
            id={nodeIndex}
            nodeType={
                nodeIndex == grid.defaultStartLocation ? NodeType.START : nodeIndex == grid.defaultFinishLocation ? NodeType.FINISH : NodeType.EMPTY
            }
            ref={(node: Node) => {
                if (grid.nodesRef.current === null) return grid.nodesRef.current = [node];
                return grid.nodesRef.current = [...grid.nodesRef.current, node];
            }}
            onMouseDown={() => {
                if (grid.nodesRef.current === null) return;
                if (!grid.isCleared()) return;

                const node = grid.nodesRef.current[nodeIndex];
                const nodeType = node.state.nodeType;

                if (nodeType.variation === NodeVariation.REPLACEABLE) {
                    node.setType(NodeType.EMPTY);
                } else if (nodeType === NodeType.EMPTY) {
                    node.setType(selectedRef.current.node);
                }

                grid.currentNode.current = node;
            }}
            onMouseEnter={() => {
                if (grid.nodesRef.current === null) return;
                if (grid.currentNode.current === null) return;
                if (!grid.isCleared()) return;

                const node = grid.nodesRef.current[nodeIndex];
                const nodeType = node.state.nodeType;
                const currentType = grid.currentNode.current.state.nodeType;

                if (currentType.variation === NodeVariation.MOVABLE && nodeType === NodeType.EMPTY) {
                    node.setType(currentType);
                    grid.currentNode.current.setType(NodeType.EMPTY);
                } else if (currentType === NodeType.EMPTY && nodeType.variation === NodeVariation.REPLACEABLE) {
                    node.setType(NodeType.EMPTY);
                } else if (currentType.variation === NodeVariation.REPLACEABLE && nodeType === NodeType.EMPTY) {
                    node.setType(selectedRef.current.node);
                } else {
                    return;
                }

                grid.currentNode.current = node;
            }}
        />
    );
};
