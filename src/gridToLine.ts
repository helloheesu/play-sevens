const gridToLine = (ROW_SIZE: number, COL_SIZE: number) => {
  const generateRandomRowIndex = () => {
    return Math.floor(Math.random() * ROW_SIZE);
  };
  const generateRandomColIndex = () => {
    return Math.floor(Math.random() * COL_SIZE);
  };

  const getIndex = (row: number, col: number) => row * COL_SIZE + col;
  const getRightIndex = (row: number, col: number) =>
    col > COL_SIZE - 2 ? null : row * COL_SIZE + col + 1;
  const getLeftIndex = (row: number, col: number) =>
    col < 1 ? null : row * COL_SIZE + col - 1;
  const getDownIndex = (row: number, col: number) =>
    row > ROW_SIZE - 2 ? null : (row + 1) * COL_SIZE + col;
  const getUpIndex = (row: number, col: number) =>
    row < 1 ? null : (row - 1) * COL_SIZE + col;

  const getGridIndexFromLineIndex = (index: number) => ({
    row: Math.floor(index / COL_SIZE),
    col: index % COL_SIZE,
  });

  return {
    generateRandomRowIndex,
    generateRandomColIndex,
    getIndex,
    getRightIndex,
    getLeftIndex,
    getDownIndex,
    getUpIndex,
    getGridIndexFromLineIndex,
    LINE_SIZE: ROW_SIZE * COL_SIZE,
  };
};

export default gridToLine;
