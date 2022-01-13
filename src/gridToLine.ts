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

export const getLeftMostIndex = (row: number, colSize: number) =>
  getIndex(row, 0, colSize);
export const getRightMostIndex = (row: number, colSize: number) =>
  getIndex(row, colSize - 1, colSize);
export const getUpMostIndex = (row: number, colSize: number) =>
  getIndex(row, colSize - 1, colSize);
export const getDownMostIndex = (row: number, colSize: number) =>
  getIndex(row, colSize - 1, colSize);

type CompareReducerCallback<S> = (
  value: S,
  { index, upcomingIndex }: { index: number; upcomingIndex: number }
) => S;
export type CompareReducer<T> = (
  callback: CompareReducerCallback<T>,
  initialValue: T
) => T;
export const getCompareReducerFromLeft = <R>(
  rowSize: number,
  colSize: number
): CompareReducer<R> => {
  return (callback, initialValue) => {
    let value = initialValue;

    for (let row = 0; row <= rowSize - 1; row++) {
      for (let col = 0; col <= colSize - 1; col++) {
        const index = getIndex(row, col, colSize);
        const upcomingIndex = getRightIndex(index, rowSize, colSize, false);
        if (upcomingIndex === null) {
          continue;
        }

        value = callback(value, { index, upcomingIndex });
      }
    }

    return value;
  };
};
export const getCompareReducerFromRight = <R>(
  rowSize: number,
  colSize: number
): CompareReducer<R> => {
  return (callback, initialValue) => {
    let value = initialValue;

    for (let row = 0; row <= rowSize - 1; row++) {
      for (let col = colSize - 1; col >= 0; col--) {
        const index = getIndex(row, col, colSize);
        const upcomingIndex = getLeftIndex(index, rowSize, colSize, false);
        if (upcomingIndex === null) {
          continue;
        }

        value = callback(value, { index, upcomingIndex });
      }
    }

    return value;
  };
};
export const getCompareReducerFromUp = <R>(
  rowSize: number,
  colSize: number
): CompareReducer<R> => {
  return (callback, initialValue) => {
    let value = initialValue;

    for (let row = 0; row <= rowSize - 1; row++) {
      for (let col = 0; col <= colSize - 1; col++) {
        const index = getIndex(row, col, colSize);
        const upcomingIndex = getDownIndex(index, rowSize, colSize, false);
        if (upcomingIndex === null) {
          continue;
        }

        value = callback(value, { index, upcomingIndex });
      }
    }

    return value;
  };
};
export const getCompareReducerFromDown = <R>(
  rowSize: number,
  colSize: number
): CompareReducer<R> => {
  return (callback, initialValue) => {
    let value = initialValue;

    for (let row = rowSize - 1; row >= 0; row--) {
      for (let col = 0; col <= colSize - 1; col++) {
        const index = getIndex(row, col, colSize);
        const upcomingIndex = getUpIndex(index, rowSize, colSize, false);
        if (upcomingIndex === null) {
          continue;
        }

        value = callback(value, { index, upcomingIndex });
      }
    }

    return value;
  };
};
