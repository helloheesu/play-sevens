import { Reducer } from 'react';
import {
  generateRandomColIndex,
  generateRandomRowIndex,
  getDownIndex,
  getIndex,
  getLeftIndex,
  getRightIndex,
  getUpIndex,
} from './gridToLine';

interface CardInfo {
  id: number;
  value: number;
}

type CardSlot = CardInfo | null;
interface State {
  rowSize: number;
  colSize: number;
  cardSlots: CardSlot[];
  initialCardCount: number;
  newCardValues: number[];
  nextNewCardValue: number;
  isGameEnded: boolean;
}

type Action = {
  type: 'resetCardSlots' | 'mergeLeft' | 'mergeRight' | 'mergeUp' | 'mergeDown';
};

const pickRandomValue = (values: number[]) => {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

let newCardId = 0;
const getNewCard = (value: number): CardSlot => {
  return {
    id: newCardId++,
    value,
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
const mergeCardIfPossible = (
  cardSlots: CardSlot[],
  previousIndex: number,
  upcomingIndex: number
): boolean => {
  const previousCard = cardSlots[previousIndex];
  const upcomingCard = cardSlots[upcomingIndex];

  if (upcomingCard) {
    if (previousCard) {
      // console.log('merging', { ...previousCard }, { ...upcomingCard });

      if (isMergeable(previousCard, upcomingCard)) {
        // console.log('mergeable??');

        cardSlots[previousIndex] = {
          ...previousCard,
          value: previousCard.value + upcomingCard.value,
        };
        cardSlots[upcomingIndex] = null;
      } else {
        // console.log('NO');
        // do nothing
        return false;
      }
    } else {
      // console.log('moving', previousCard, upcomingCard);
      cardSlots[previousIndex] = upcomingCard;
      cardSlots[upcomingIndex] = null;
    }
    return true;
  }
  return false;
};
const isAnyMoveable = (
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

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'resetCardSlots': {
      const initialCardSlots = new Array(state.rowSize * state.colSize);
      const newValue = pickRandomValue(state.newCardValues);
      const initialCardInfo = { row: 2, col: 1, value: newValue };
      initialCardSlots[
        getIndex(initialCardInfo.row, initialCardInfo.col, state.colSize)
      ] = getNewCard(initialCardInfo.value);

      return {
        ...state,
        cardSlots: initialCardSlots,
        nextNewCardValue: pickRandomValue(state.newCardValues),
      };
    }
    case 'mergeLeft': {
      const newCardSlots = [...state.cardSlots];
      let hasAnyMoved = false;

      for (let col = 0; col <= state.colSize - 1; col++) {
        for (let row = 0; row <= state.rowSize - 1; row++) {
          const index = getIndex(row, col, state.colSize);
          const rightIndex = getRightIndex(index, state.rowSize, state.colSize);
          if (rightIndex === null) {
            continue;
          }

          const hasMoved = mergeCardIfPossible(newCardSlots, index, rightIndex);
          hasAnyMoved = hasAnyMoved || hasMoved;
        }
      }

      let newValue = state.nextNewCardValue;
      if (hasAnyMoved) {
        let row = generateRandomRowIndex(state.rowSize);
        const col = state.colSize - 1;

        let newCardIndex = getIndex(row, col, state.colSize);
        while (newCardSlots[newCardIndex]) {
          newCardIndex = getDownIndex(
            newCardIndex,
            state.rowSize,
            state.colSize,
            true
          )!;
        }

        newValue = pickRandomValue(state.newCardValues);
        newCardSlots[newCardIndex] = getNewCard(state.nextNewCardValue);
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        nextNewCardValue: newValue,
        isGameEnded,
      };
    }
    case 'mergeRight': {
      const newCardSlots = [...state.cardSlots];
      let hasAnyMoved = false;

      for (let col = state.colSize - 1; col >= 0; col--) {
        for (let row = 0; row <= state.rowSize - 1; row++) {
          const index = getIndex(row, col, state.colSize);
          const leftIndex = getLeftIndex(index, state.rowSize, state.colSize);
          if (leftIndex === null) {
            continue;
          }

          const hasMoved = mergeCardIfPossible(newCardSlots, index, leftIndex);
          hasAnyMoved = hasAnyMoved || hasMoved;
        }
      }

      let newValue = state.nextNewCardValue;
      if (hasAnyMoved) {
        let row = generateRandomRowIndex(state.rowSize);
        const col = 0;

        let newCardIndex = getIndex(row, col, state.colSize);
        while (newCardSlots[newCardIndex]) {
          newCardIndex = getDownIndex(
            newCardIndex,
            state.rowSize,
            state.colSize,
            true
          )!;
        }

        newValue = pickRandomValue(state.newCardValues);
        newCardSlots[newCardIndex] = getNewCard(state.nextNewCardValue);
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        nextNewCardValue: newValue,
        isGameEnded,
      };
    }
    case 'mergeUp': {
      const newCardSlots = [...state.cardSlots];
      let hasAnyMoved = false;

      for (let row = 0; row <= state.rowSize - 1; row++) {
        for (let col = 0; col <= state.colSize - 1; col++) {
          const index = getIndex(row, col, state.colSize);
          const downIndex = getDownIndex(index, state.rowSize, state.colSize);
          if (downIndex === null) {
            continue;
          }

          const hasMoved = mergeCardIfPossible(newCardSlots, index, downIndex);
          hasAnyMoved = hasAnyMoved || hasMoved;
        }
      }

      let newValue = state.nextNewCardValue;
      if (hasAnyMoved) {
        let col = generateRandomColIndex(state.colSize);
        const row = state.rowSize - 1;

        let newCardIndex = getIndex(row, col, state.colSize);
        while (newCardSlots[newCardIndex]) {
          newCardIndex = getRightIndex(
            newCardIndex,
            state.rowSize,
            state.colSize,
            true
          )!;
        }

        newValue = pickRandomValue(state.newCardValues);
        newCardSlots[newCardIndex] = getNewCard(state.nextNewCardValue);
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        nextNewCardValue: newValue,
        isGameEnded,
      };
    }
    case 'mergeDown': {
      const newCardSlots = [...state.cardSlots];
      let hasAnyMoved = false;

      for (let row = state.rowSize - 1; row >= 0; row--) {
        for (let col = 0; col <= state.colSize - 1; col++) {
          const index = getIndex(row, col, state.colSize);
          const upIndex = getUpIndex(index, state.rowSize, state.colSize);
          if (upIndex === null) {
            continue;
          }

          const hasMoved = mergeCardIfPossible(newCardSlots, index, upIndex);
          hasAnyMoved = hasAnyMoved || hasMoved;
        }
      }

      let newValue = state.nextNewCardValue;
      if (hasAnyMoved) {
        let col = generateRandomColIndex(state.colSize);
        const row = 0;

        let newCardIndex = getIndex(row, col, state.colSize);
        while (newCardSlots[newCardIndex]) {
          newCardIndex = getRightIndex(
            newCardIndex,
            state.rowSize,
            state.colSize,
            true
          )!;
        }

        newValue = pickRandomValue(state.newCardValues);
        newCardSlots[newCardIndex] = getNewCard(state.nextNewCardValue);
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        nextNewCardValue: newValue,
        isGameEnded,
      };
    }
    default:
      return state;
  }
};

export default reducer;
