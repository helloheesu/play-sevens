export const generateRandomRowIndex = (rowSize: number) => {
  return Math.floor(Math.random() * rowSize);
};
export const generateRandomColIndex = (colSize: number) => {
  return Math.floor(Math.random() * colSize);
};

interface Payload {
  row: number;
  col: number;
  rowSize: number;
  colSize: number;
}
export const getIndex = ({ row, col, colSize }: Payload) => row * colSize + col;
export const getRightIndex = ({ row, col, colSize }: Payload) =>
  col > colSize - 2 ? null : row * colSize + col + 1;
export const getLeftIndex = ({ row, col, colSize }: Payload) =>
  col < 1 ? null : row * colSize + col - 1;
export const getDownIndex = ({ row, col, rowSize, colSize }: Payload) =>
  row > rowSize - 2 ? null : (row + 1) * colSize + col;
export const getUpIndex = ({ row, col, colSize }: Payload) =>
  row < 1 ? null : (row - 1) * colSize + col;

export const getGridIndexFromLineIndex = (index: number, colSize: number) => ({
  row: Math.floor(index / colSize),
  col: index % colSize,
});
