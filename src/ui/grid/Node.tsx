import React, {Component} from "react";
import styled from "styled-components";
import {NODE_SIZE} from "../../utils/settings";

const NodeContainer = styled.span`
  display: inline-block;
  width: ${NODE_SIZE}px;
  height: ${NODE_SIZE}px;
  outline: solid 1px var(--background-accent);
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${NODE_SIZE - 5}px;
`;

interface NodeProps {
    id: number;
    nodeType: NodeType;
    onMouseDown: () => void;
    onMouseEnter: () => void;
}

interface NodeState {
    pathType: PathNodeType | undefined;
    nodeType: NodeType;
    animate: boolean;
}

export default class Node extends Component<NodeProps, NodeState> {
    constructor(props: NodeProps) {
        super(props);
        this.state = {pathType: undefined, nodeType: props.nodeType ?? NodeType.EMPTY, animate: true};
    }

    setType = (nodeType: NodeType) => {
        if (nodeType === NodeType.WALL || nodeType.variation === NodeVariation.MOVABLE) {
            this.setState({...this.state, pathType: undefined, nodeType});
        } else {
            this.setState({...this.state, nodeType});
        }
    };
    setPathType = (pathType: PathNodeType | undefined, animate: boolean) => {
        this.setState({...this.state, pathType, animate});
    };

    clear = () => {
        this.setState({
            ...this.state,
            pathType: undefined,
            nodeType: this.state.nodeType.variation == NodeVariation.REPLACEABLE ? NodeType.EMPTY : this.state.nodeType
        });
    };
    reset = () => {
        this.setState({...this.state, pathType: undefined, nodeType: NodeType.EMPTY});
    };

    render() {
        return (
            <NodeContainer
                className={`node ${this.state.animate ? "node-animation" : ""} ${this.state.nodeType.className} ${this.state.pathType?.className ?? ""}`}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
            ></NodeContainer>
        );
    }
}

export enum NodeVariation {
    EMPTY,
    REPLACEABLE,
    MOVABLE
}

export type NodeTypeIdType = "START" | "FINISH" | "WEIGHT" | "WALL" | "EMPTY"

export class NodeType {
    static readonly START = new NodeType("START", "node-start", NodeVariation.MOVABLE);
    static readonly FINISH = new NodeType("FINISH", "node-finish", NodeVariation.MOVABLE);
    static readonly WEIGHT = new NodeType("WEIGHT", "node-weight", NodeVariation.REPLACEABLE);
    static readonly WALL = new NodeType("WALL", "node-wall", NodeVariation.REPLACEABLE);
    static readonly EMPTY = new NodeType("EMPTY", "node-empty", NodeVariation.EMPTY);

    private constructor(public readonly id: NodeTypeIdType, public readonly className: string, public readonly variation: NodeVariation) {
    }
}

export class PathNodeType {
    static readonly VISITED = new PathNodeType("node-visited");
    static readonly PATH = new PathNodeType("node-path");

    private constructor(public readonly className: string) {
    }
}
