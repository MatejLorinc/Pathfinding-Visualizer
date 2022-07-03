import {Button, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React, {FC, MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";
import {GRID_MARGIN, neighborItems, NODE_SIZE, setDefaultRows, Settings} from "../../utils/settings";
import Grid from "../grid/Grid";
import {SettingsDropdown} from "./settings/Settings";
import {BoardEditor} from "./BoardEditor";
import {NodeType, NodeTypeIdType} from "../grid/Node";
import styled from "styled-components";
import {findPath, visualizePathFind} from "../../algorithms/utils";

const HeaderContainer = styled.div`
  height: var(--header-height);
  background-color: rgb(255, 255, 255, 0.07);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  font-size: 1.5em;
  padding: 0 1em;
`;

const ItemList = styled.ul`
  max-width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;

  & > * {
    display: flex;
    align-content: flex-start;
    align-self: center;
  }
`;

interface HeaderProps {
    rows: number;
    columns: number;
    handleDimensionsChange: (rows: number, columns: number) => void;
    grid: MutableRefObject<Grid | null>;
    settings: Settings;
    selected: { node: NodeType, algorithm: string };
    isPathFinding: boolean;
    setPathFinding: React.Dispatch<React.SetStateAction<boolean>>;
    isGridCleared: boolean;
    setGridCleared: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: FC<HeaderProps> = (props) => {
    const skipAnimation = useRef(false);
    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);

    useEffect(() => {
        if (ref.current === null) return;

        const height = window.innerHeight - ref.current?.offsetHeight;
        const rows = Math.floor((height - GRID_MARGIN) / NODE_SIZE);
        setDefaultRows(rows);
        props.handleDimensionsChange(rows, props.columns);
    }, []);

    return (
        <HeaderContainer ref={ref}>
            <ItemList>
                <SettingsDropdown settings={props.settings} disabled={props.isPathFinding}/>
                <SelectMenu label="Algorithm"
                            selectItem={(id) => props.selected.algorithm = id}
                            default={props.selected.algorithm}
                            disabled={props.isPathFinding}>
                    <MenuItem value={"dijkstra"}>Dijkstra</MenuItem>
                    <MenuItem value={"aStar"}>A*</MenuItem>
                    <MenuItem value={"bfs"}>Breadth-first (unweighted)</MenuItem>
                    <MenuItem value={"dfs"}>Depth-first (unweighted)</MenuItem>
                </SelectMenu>
                <Button
                    variant="contained"
                    size="large"
                    color={props.isPathFinding ? "error" : props.isGridCleared ? "primary" : "success"}
                    sx={{width: 150}}
                    onClick={() => {
                        if (props.grid.current === null) return;

                        if (props.isPathFinding) {
                            skipAnimation.current = true;
                        } else if (!props.isGridCleared) {
                            props.grid.current?.clearPath();
                        } else {
                            props.setPathFinding(true);
                            props.setGridCleared(false);
                            visualizePathFind(
                                findPath(
                                    props.selected.algorithm,
                                    props.grid.current,
                                    props.settings.neighborOrder.enabledColumn.itemIds.map((itemId) => neighborItems[itemId])
                                ),
                                props.settings.animationSpeed.visitDelay,
                                props.settings.animationSpeed.pathDelay,
                                skipAnimation
                            ).finally(() => {
                                props.setPathFinding(false);
                                skipAnimation.current = false;
                            });
                        }
                    }}
                >
                    {props.isPathFinding ? "Skip" : props.isGridCleared ? "Visualize" : "Clear Path"}
                </Button>
                <SelectMenu label="Node Type"
                            selectItem={(id) => props.selected.node = (NodeType[id as NodeTypeIdType])}
                            default={props.selected.node.id}
                            disabled={props.isPathFinding}>
                    <MenuItem value="WALL">Wall</MenuItem>
                    <MenuItem value="WEIGHT">Weight</MenuItem>
                </SelectMenu>
                <BoardEditor rows={props.rows} columns={props.columns}
                             handleDimensionsChange={props.handleDimensionsChange} grid={props.grid}
                             disabled={props.isPathFinding}/>
            </ItemList>
        </HeaderContainer>
    );
};

interface DropdownProps {
    name: string;
    icon: ReactElement;
    disabled?: boolean;
}

export const Dropdown: FC<DropdownProps> = (props) => {
    const [anchor, setAnchor] = useState(null);

    const handleClick = (event: any) => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    const open = Boolean(anchor);

    return (
        <>
            <IconButton
                disabled={props.disabled}
                aria-label={props.name}
                id={props.name + "-button"}
                aria-controls={open ? props.name + "-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                {props.icon}
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": props.name + "-button",
                }}
            >
                {props.children}
            </Menu>
        </>
    );
};

interface SelectMenuProps {
    label: string;
    selectItem: (itemId: string) => void;
    default?: any;
    disabled?: boolean;
}

export const SelectMenu: FC<SelectMenuProps> = (props) => {
    const [item, setItem] = useState(props.default ?? "");

    const handleChange = (event: SelectChangeEvent<any>) => {
        props.selectItem(event.target.value.toUpperCase());
        setItem(event.target.value);
    };

    return (
        <FormControl variant="standard" sx={{minWidth: 150}}>
            <InputLabel id={`${props.label}-label`}>{props.label}</InputLabel>
            <Select disabled={props.disabled} id={props.label} label={props.label} value={item} onChange={handleChange}>
                {props.children}
            </Select>
        </FormControl>
    );
};
