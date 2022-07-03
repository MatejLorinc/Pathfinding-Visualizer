export const limitNumberField = (event: any, min = 0, max = Infinity) => {
    event.target.value = event.target.value === "" ? min : Math.max(min, Math.min(max, parseInt(event.target.value)));
};
export const getId = (row: number, column: number, rows: number, columns: number) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) return -1;
    return row * columns + column;
};
export const getRow = (id: number, columns: number) => {
    return Math.floor(id / columns);
};
export const getColumn = (id: number, columns: number) => {
    return id % columns;
};