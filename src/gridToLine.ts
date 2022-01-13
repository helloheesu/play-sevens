export const generateRandomRowIndex = (rowSize: number) => {
  return Math.floor(Math.random() * rowSize);
};
export const generateRandomColIndex = (colSize: number) => {
  return Math.floor(Math.random() * colSize);
};

export const getIndex = (row: number, col: number, colSize: number) =>
  row * colSize + col;

export const getRightIndex = (
  row: number,
  col: number,
  colSize: number,
  circular: boolean = false
) =>
  circular || col <= colSize - 2
    ? getIndex(row, (col + 1) % colSize, colSize)
    : null;
export const getLeftIndex = (
  row: number,
  col: number,
  colSize: number,
  circular: boolean = false
) =>
  circular || col >= 1
    ? getIndex(row, (col - 1 + colSize) % colSize, colSize)
    : null;
export const getDownIndex = (
  row: number,
  col: number,
  rowSize: number,
  colSize: number,
  circular: boolean = false
) =>
  circular || row <= rowSize - 2
    ? getIndex((row + 1) % rowSize, col, colSize)
    : null;
export const getUpIndex = (
  row: number,
  col: number,
  rowSize: number,
  colSize: number,
  circular: boolean = false
) =>
  circular || row >= 1
    ? getIndex((row - 1 + rowSize) % rowSize, col, colSize)
    : null;

export const getGridIndexFromLineIndex = (index: number, colSize: number) => ({
  row: Math.floor(index / colSize),
  col: index % colSize,
});
