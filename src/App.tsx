import {createTheme, ThemeProvider} from "@mui/material";
import {blue} from "@mui/material/colors";
import React, {useMemo, useRef, useState} from "react";
import {Header} from "./ui/header/Header.js";
import {defaultSettings, GRID_MARGIN, NODE_SIZE} from "./utils/settings";
import {NodeType} from "./ui/grid/Node";

function App() {
    const theme = createTheme({
        palette: {
            mode: "dark",
            ...{
                primary: blue,
            },
        },
    });

    const gridRef = useRef(null);
    const [rows, setRows] = useState(1);
    const [columns, setColumns] = useState(Math.floor((window.innerWidth - GRID_MARGIN) / NODE_SIZE));
    const settings = useRef(defaultSettings);
    const selected = useRef({node: NodeType.WALL, algorithm: "aStar"});
    const [isPathFinding, setPathFinding] = useState(false);
    const [isGridCleared, setGridCleared] = useState(true);

    const grid = useMemo(() => {
        const Grid = React.lazy(() => import("./ui/grid/Grid"));
        return <Grid rows={rows} columns={columns} ref={gridRef} selectedRef={selected}
                     setGridCleared={setGridCleared}/>;
    }, [rows, columns]);

    const handleDimensionsChange = (rows: number, columns: number) => {
        setRows(rows);
        setColumns(columns);
    };

    return (
        <ThemeProvider theme={theme}>
            <Header
                rows={rows}
                columns={columns}
                handleDimensionsChange={handleDimensionsChange}
                grid={gridRef}
                settings={settings.current}
                selected={selected.current}
                isPathFinding={isPathFinding}
                setPathFinding={setPathFinding}
                isGridCleared={isGridCleared}
                setGridCleared={setGridCleared}
            ></Header>
            <React.Suspense fallback={<h1>Loading grid</h1>}>
                {grid}
            </React.Suspense>
        </ThemeProvider>
    );
}

export default App;
