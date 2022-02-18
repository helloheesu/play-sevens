import { CardSlot } from '../reducer';
import {
  Direction,
  getAdjacentIndex,
  getDownIndex,
  getIndex,
  getLeftIndex,
  getRightIndex,
  getUpIndex,
} from './gridToLine';

export type IsMoveable = {
  [key in Direction]: boolean;
};

export const updateMoveable = (
  cardSlots: CardSlot[],
  rowSize: number,
  colSize: number
) => {
  for (let row = 0; row < rowSize; row++) {
    for (let col = 0; col < colSize; col++) {
      const index = getIndex(row, col, colSize);
      const card = cardSlots[index];
      if (!card) {
        continue;
      }
      card.isMoveable.left = isMoveableToDirection(
        'left',
        index,
        cardSlots,
        rowSize,
        colSize
      );
      card.isMoveable.up = isMoveableToDirection(
        'up',
        index,
        cardSlots,
        rowSize,
        colSize
      );
    }
  }
  for (let row = rowSize - 1; row >= 0; row--) {
    for (let col = colSize - 1; col >= 0; col--) {
      const index = getIndex(row, col, colSize);
      const card = cardSlots[index];
      if (!card) {
        continue;
      }
      card.isMoveable.right = isMoveableToDirection(
        'right',
        index,
        cardSlots,
        rowSize,
        colSize
      );
      card.isMoveable.down = isMoveableToDirection(
        'down',
        index,
        cardSlots,
        rowSize,
        colSize
      );
    }
  }
};

export const getAllMoveableObj = () => ({
  left: true,
  right: true,
  up: true,
  down: true,
});

const isMoveableToDirection = (
  direction: Direction,
  index: number,
  cardSlots: CardSlot[],
  rowSize: number,
  colSize: number
): boolean => {
  const adjacentIndex = getAdjacentIndex(
    direction,
    index,
    rowSize,
    colSize,
    false
  );
  if (typeof adjacentIndex !== 'number') {
    return false;
  }
  const card = cardSlots[index];
  const adjacentCard = cardSlots[adjacentIndex];
  if (!adjacentCard) {
    return true;
  }
  if (adjacentCard.isMoveable[direction]) {
    return true;
  }
  return isMergeable(card, adjacentCard);
};

export const isMoveable = (
  ...args: [
    index: number,
    cardSlots: CardSlot[],
    rowSize: number,
    colSize: number
  ]
): IsMoveable => {
  return {
    left: isMoveableToDirection('left', ...args),
    right: isMoveableToDirection('right', ...args),
    up: isMoveableToDirection('up', ...args),
    down: isMoveableToDirection('down', ...args),
  };
};

const isMergeable = (cardA: CardSlot, cardB: CardSlot): boolean => {
  if (!cardA || !cardB) {
    return true;
  }

  if (cardA.value + cardB.value === 3) {
    return true;
  }

  return (cardA.value + cardB.value) % 3 === 0 && cardA.value === cardB.value;
};

export const mergeCardIfPossible = (
  cardSlots: CardSlot[],
  previousIndex: number,
  upcomingIndex: number
): boolean => {
  const previousCard = cardSlots[previousIndex];
  const upcomingCard = cardSlots[upcomingIndex];

  if (upcomingCard) {
    if (previousCard) {
      if (isMergeable(previousCard, upcomingCard)) {
        cardSlots[previousIndex] = {
          ...previousCard,
          value: previousCard.value + upcomingCard.value,
        };
        cardSlots[upcomingIndex] = null;
      } else {
        // do nothing
        return false;
      }
    } else {
      cardSlots[previousIndex] = upcomingCard;
      cardSlots[upcomingIndex] = null;
    }
    return true;
  }
  return false;
};

export const isAnyMoveable = (
  cardSlots: CardSlot[],
  rowSize: number,
  colSize: number
): boolean => {
  for (let row = 0; row < rowSize; row++) {
    for (let col = 0; col < colSize; col++) {
      const index = getIndex(row, col, colSize);
      const card = cardSlots[index];

      if (!card) {
        return true;
      }

      const rightIndex = getRightIndex(index, rowSize, colSize);
      if (rightIndex !== null && isMergeable(card, cardSlots[rightIndex])) {
        return true;
      }

      const leftIndex = getLeftIndex(index, rowSize, colSize);
      if (leftIndex !== null && isMergeable(card, cardSlots[leftIndex])) {
        return true;
      }

      const downIndex = getDownIndex(index, rowSize, colSize);
      if (downIndex !== null && isMergeable(card, cardSlots[downIndex])) {
        return true;
      }

      const upIndex = getUpIndex(index, rowSize, colSize);
      if (upIndex !== null && isMergeable(card, cardSlots[upIndex])) {
        return true;
      }
    }
  }
  return false;
};
