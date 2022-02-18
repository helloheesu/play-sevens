import { mergeCardIfPossible, updateMoveable } from '../utils/merge';
import { getCompareReducerFromDown } from '../utils/gridToLine';
import {
  getBeforeSlots,
  getMoveableUpdatedSlots,
  getMovedDownSlots,
} from './data';

const rowSize = 4,
  colSize = 4;

test('mergeCardIfPossible - from empty', () => {
  const slots = getBeforeSlots();
  const index = 12,
    upcomingIndex = 8;
  mergeCardIfPossible(slots, index, upcomingIndex);

  const result = getBeforeSlots();
  expect(slots).toEqual(result);
});

test('mergeCardIfPossible - to empty', () => {
  const slots = getBeforeSlots();
  const index = 13,
    upcomingIndex = 9;
  mergeCardIfPossible(slots, index, upcomingIndex);

  const result = getBeforeSlots();
  result[index] = result[upcomingIndex];
  result[upcomingIndex] = null;

  expect(slots).toEqual(result);
});

test('mergeCardIfPossible - not mergeable', () => {
  const slots = getBeforeSlots();
  const index = 15,
    upcomingIndex = 14;
  mergeCardIfPossible(slots, index, upcomingIndex);

  const result = getBeforeSlots();
  expect(slots).toEqual(result);
});

test('mergeCardIfPossible - mergeable', () => {
  const slots = getBeforeSlots();
  const index = 15,
    upcomingIndex = 11;
  mergeCardIfPossible(slots, index, upcomingIndex);

  const result = getBeforeSlots();
  result[index]!.value = result[index]!.value + result[upcomingIndex]!.value;
  result[upcomingIndex] = null;

  expect(slots).toEqual(result);
});

test('reduceMerge', () => {
  const slots = getBeforeSlots();

  getCompareReducerFromDown(rowSize, colSize)(
    (hasAnyMoved, { index, upcomingIndex }) => {
      const hasMoved = mergeCardIfPossible(slots, index, upcomingIndex);
      return hasAnyMoved || hasMoved;
    },
    false
  );

  const result = getMovedDownSlots();

  expect(slots).toEqual(result);
});

test('updateMoveable', () => {
  const slots = getMovedDownSlots();
  const newCard = {
    index: 2,
    value: 2,
  };
  slots[newCard.index] = {
    value: newCard.value,
    id: 1379,
    isMoveable: {
      left: true,
      right: true,
      up: true,
      down: true,
    },
  };

  updateMoveable(slots, rowSize, colSize);

  expect(slots).toEqual(getMoveableUpdatedSlots());
});
