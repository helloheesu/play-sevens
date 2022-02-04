import { getShuffledArray } from './random';

const INITIAL_NEW_CARD_VALUES = [1, 1, 1, 2, 2, 2, 3];

export const getInitialCardValues = (maximumValue: number = 3) => {
  return getShuffledArray(INITIAL_NEW_CARD_VALUES);
};
