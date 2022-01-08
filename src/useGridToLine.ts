import { useCallback } from 'react';

const useGridToLine = (ROW_SIZE: number, COL_SIZE: number) => {
  const generateRandomRowIndex = useCallback(() => {
    return Math.floor(Math.random() * ROW_SIZE);
  }, [ROW_SIZE]);
  const generateRandomColIndex = useCallback(() => {
    return Math.floor(Math.random() * COL_SIZE);
  }, [COL_SIZE]);

  const getIndex = useCallback(
    (row: number, col: number) => row * COL_SIZE + col,
    [COL_SIZE]
  );
  const getRightIndex = useCallback(
    (row: number, col: number) =>
      col > COL_SIZE - 2 ? null : row * COL_SIZE + col + 1,
    [COL_SIZE]
  );
  const getLeftIndex = useCallback(
    (row: number, col: number) => (col < 1 ? null : row * COL_SIZE + col - 1),
    [COL_SIZE]
  );
  const getDownIndex = useCallback(
    (row: number, col: number) =>
      row > ROW_SIZE - 2 ? null : (row + 1) * COL_SIZE + col,
    [COL_SIZE, ROW_SIZE]
  );
  const getUpIndex = useCallback(
    (row: number, col: number) => (row < 1 ? null : (row - 1) * COL_SIZE + col),
    [COL_SIZE]
  );

  const getGridIndexFromLineIndex = useCallback(
    (index: number) => ({
      row: Math.floor(index / COL_SIZE),
      col: index % COL_SIZE,
    }),
    [COL_SIZE]
  );

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

export default useGridToLine;
