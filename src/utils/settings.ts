import {Direction} from "../ui/header/settings/Neighbors";
import {getId} from "./utils";
import topArrow from "/assets/arrows/top.svg";
import bottomArrow from "/assets/arrows/bottom.svg";
import leftArrow from "/assets/arrows/left.svg";
import rightArrow from "/assets/arrows/right.svg";
import topLeftArrow from "/assets/arrows/topLeft.svg";
import topRightArrow from "/assets/arrows/topRight.svg";
import bottomLeftArrow from "/assets/arrows/bottomLeft.svg";
import bottomRightArrow from "/assets/arrows/bottomRight.svg";

export const NODE_SIZE = 25;
export const GRID_MARGIN = 25;
export const WEIGHT = 5;

export let defaultRows = 1;
export const setDefaultRows = (rows: number) => {
    defaultRows = rows;
};

export interface Settings {
    animationSpeed: AnimationSpeed;
    neighborOrder: NeighborOrder;
}

export interface AnimationSpeed {
    visitDelay: number,
    pathDelay: number,

    [key: string]: number
}

export interface NeighborOrder {
    enabledColumn: NeighborColumn,
    disabledColumn: NeighborColumn,

    [key: string]: NeighborColumn
}

export interface NeighborColumn {
    id: string,
    title: string,
    itemIds: string[]
}

export const defaultSettings = {
    animationSpeed: {
        visitDelay: 10,
        pathDelay: 75,
    },
    neighborOrder: {
        enabledColumn: {
            id: "enabledColumn",
            title: "Enabled",
            itemIds: ["top", "left", "right", "bottom"],
        },
        disabledColumn: {
            id: "disabledColumn",
            title: "Disabled",
            itemIds: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
        },
    },
};

export interface Neighbor {
    id: Direction,
    name: string,
    iconDest: string,
    getItemId: (row: number, column: number, rows: number, columns: number) => number,
    isDiagonal: boolean
}

export const neighborItems: { [key: string]: Neighbor } = {
    top: {
        id: "top",
        name: "Top",
        iconDest: topArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row - 1, column, rows, columns),
        isDiagonal: false,
    },
    left: {
        id: "left",
        name: "Left",
        iconDest: leftArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row, column - 1, rows, columns),
        isDiagonal: false,
    },
    right: {
        id: "right",
        name: "Right",
        iconDest: rightArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row, column + 1, rows, columns),
        isDiagonal: false,
    },
    bottom: {
        id: "bottom",
        name: "Bottom",
        iconDest: bottomArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row + 1, column, rows, columns),
        isDiagonal: false,
    },
    topLeft: {
        id: "topLeft",
        name: "Top Left",
        iconDest: topLeftArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row - 1, column - 1, rows, columns),
        isDiagonal: true,
    },
    topRight: {
        id: "topRight",
        name: "Top Right",
        iconDest: topRightArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row - 1, column + 1, rows, columns),
        isDiagonal: true,
    },
    bottomLeft: {
        id: "bottomLeft",
        name: "Bottom Left",
        iconDest: bottomLeftArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row + 1, column - 1, rows, columns),
        isDiagonal: true,
    },
    bottomRight: {
        id: "bottomRight",
        name: "Bottom Right",
        iconDest: bottomRightArrow,
        getItemId: (row: number, column: number, rows: number, columns: number) => getId(row + 1, column + 1, rows, columns),
        isDiagonal: true,
    },
};
