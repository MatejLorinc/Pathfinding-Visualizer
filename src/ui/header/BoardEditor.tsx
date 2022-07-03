import {Crop, DeleteOutlineOutlined, GridView, RestartAlt} from "@mui/icons-material";
import {Button, Dialog, DialogTitle, MenuItem, TextField} from "@mui/material";
import {ChangeEvent, FC, MutableRefObject, useState} from "react";
import {limitNumberField} from "../../utils/utils";
import Grid from "../grid/Grid";
import {Dropdown} from "./Header";

interface BoardEditorProps {
    grid: MutableRefObject<Grid | null>;
    rows: number;
    columns: number;
    handleDimensionsChange: (rows: number, columns: number) => void;
    disabled?: boolean;
}

export const BoardEditor: FC<BoardEditorProps> = (props) => {
    return (
        <Dropdown name="Board" icon={<GridView/>} disabled={props.disabled}>
            <MenuItem onClick={() => {
                if (props.grid.current === null) return;

                props.grid.current.clear();
            }}>
                <DeleteOutlineOutlined/> Clear
            </MenuItem>
            <MenuItem onClick={() => {
                if (props.grid.current === null) return;

                props.grid.current.reset();
            }}>
                <RestartAlt/>
                Reset
            </MenuItem>
            <BoardResizer rows={props.rows} columns={props.columns}
                          handleDimensionsChange={props.handleDimensionsChange}/>
        </Dropdown>
    );
};

interface DimensionProps {
    label: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: number;
}

const Dimension: FC<DimensionProps> = ({label, onChange, value}) => {
    const max = 200;

    return (
        <TextField
            type="number"
            sx={{width: 125, margin: 2}}
            label={label}
            value={value}
            onChange={onChange}
            onInput={(event) => limitNumberField(event, 0, max)}
            inputProps={{max}}
        />
    );
};

interface BoardResizerProps {
    rows: number;
    columns: number;
    handleDimensionsChange: (rows: number, columns: number) => void;
}

const BoardResizer: FC<BoardResizerProps> = (props) => {
    const minDimensionSize = 5;
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState(props.rows);
    const [columns, setColumns] = useState(props.columns);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRowChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRows(parseInt(event.target.value));
    };

    const handleColumnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setColumns(parseInt(event.target.value));
    };

    const resizeGrid = () => {
        handleClose();
        props.handleDimensionsChange(Math.max(minDimensionSize, rows), Math.max(minDimensionSize, columns));
    };

    return (
        <>
            <MenuItem onClick={handleOpen}>
                <Crop></Crop>Resize
            </MenuItem>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Resize board</DialogTitle>
                <div>
                    <Dimension label="Rows" onChange={handleRowChange} value={rows}/>
                    <Dimension label="Columns" onChange={handleColumnChange} value={columns}/>
                </div>
                <Button onClick={resizeGrid}>Resize</Button>
            </Dialog>
        </>
    );
};
