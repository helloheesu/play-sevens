import { atom, selector } from 'recoil';

export const gridSizeState = atom({
  key: 'gridSizeState',
  default: {
    row: 5,
    col: 3,
  },
});

export const generateRandomRowIndexState = selector({
  key: 'generateRandomRowIndex',
  get: ({ get }) => {
    const { row } = get(gridSizeState);
    return () => {
      return Math.floor(Math.random() * row);
    };
  },
});
export const generateRandomColIndexState = selector({
  key: 'generateRandomColIndex',
  get: ({ get }) => {
    const { col } = get(gridSizeState);
    return () => {
      return Math.floor(Math.random() * col);
    };
  },
});
