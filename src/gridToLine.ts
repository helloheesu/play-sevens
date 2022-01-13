export const generateRandomRowIndex = (rowSize: number) => {
  return Math.floor(Math.random() * rowSize);
};
export const generateRandomColIndex = (colSize: number) => {
  return Math.floor(Math.random() * colSize);
};

export const getIndex = (row: number, col: number, colSize: number) =>
  row * colSize + col;
export const getGridIndexFromLineIndex = (index: number, colSize: number) => ({
  row: Math.floor(index / colSize),
  col: index % colSize,
});

export const getRightIndex = (
  index: number,
  _rowSize: number,
  colSize: number,
  circular: boolean = false
) => {
  const { row, col } = getGridIndexFromLineIndex(index, colSize);
  return circular || col <= colSize - 2
    ? getIndex(row, (col + 1) % colSize, colSize)
    : null;
};
export const getLeftIndex = (
  index: number,
  _rowSize: number,
  colSize: number,
  circular: boolean = false
) => {
  const { row, col } = getGridIndexFromLineIndex(index, colSize);
  return circular || col >= 1
    ? getIndex(row, (col - 1 + colSize) % colSize, colSize)
    : null;
};
export const getDownIndex = (
  index: number,
  rowSize: number,
  colSize: number,
  circular: boolean = false
) => {
  const { row, col } = getGridIndexFromLineIndex(index, colSize);
  return circular || row <= rowSize - 2
    ? getIndex((row + 1) % rowSize, col, colSize)
    : null;
};
export const getUpIndex = (
  index: number,
  rowSize: number,
  colSize: number,
  circular: boolean = false
) => {
  const { row, col } = getGridIndexFromLineIndex(index, colSize);
  return circular || row >= 1
    ? getIndex((row - 1 + rowSize) % rowSize, col, colSize)
    : null;
};
