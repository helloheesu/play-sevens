import { Reducer } from 'react';
import {
  CompareReducer,
  generateRandomColIndex,
  generateRandomRowIndex,
  getCompareReducerFromDown,
  getCompareReducerFromLeft,
  getCompareReducerFromRight,
  getCompareReducerFromUp,
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

type Direction = 'left' | 'right' | 'up' | 'down';
type Action =
  | {
      type:
        | 'resetCardSlots'
        | 'mergeLeft'
        | 'mergeRight'
        | 'mergeUp'
        | 'mergeDown';
    }
  | { type: 'merge'; direction: Direction };

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
    case 'merge': {
      const newCardSlots = [...state.cardSlots];
      let compareReduce: CompareReducer<boolean>,
        getNewCardIndex: (cardSlots: CardSlot[]) => number;
      switch (action.direction) {
        case 'left':
          compareReduce = getCompareReducerFromLeft(
            state.rowSize,
            state.colSize
          );
          getNewCardIndex = (cardSlots) => {
            let row = generateRandomRowIndex(state.rowSize);
            const col = state.colSize - 1;

            let newCardIndex = getIndex(row, col, state.colSize);
            while (cardSlots[newCardIndex]) {
              newCardIndex = getDownIndex(
                newCardIndex,
                state.rowSize,
                state.colSize,
                true
              )!;
            }

            return newCardIndex;
          };
          break;
        case 'right':
          compareReduce = getCompareReducerFromRight(
            state.rowSize,
            state.colSize
          );
          getNewCardIndex = (cardSlots) => {
            let row = generateRandomRowIndex(state.rowSize);
            const col = 0;

            let newCardIndex = getIndex(row, col, state.colSize);
            while (cardSlots[newCardIndex]) {
              newCardIndex = getDownIndex(
                newCardIndex,
                state.rowSize,
                state.colSize,
                true
              )!;
            }

            return newCardIndex;
          };
          break;
        case 'up':
          compareReduce = getCompareReducerFromUp(state.rowSize, state.colSize);
          getNewCardIndex = (cardSlots) => {
            let col = generateRandomColIndex(state.colSize);
            const row = state.rowSize - 1;

            let newCardIndex = getIndex(row, col, state.colSize);
            while (cardSlots[newCardIndex]) {
              newCardIndex = getRightIndex(
                newCardIndex,
                state.rowSize,
                state.colSize,
                true
              )!;
            }

            return newCardIndex;
          };
          break;
        case 'down':
          compareReduce = getCompareReducerFromDown(
            state.rowSize,
            state.colSize
          );
          getNewCardIndex = (cardSlots) => {
            let col = generateRandomColIndex(state.colSize);
            const row = 0;

            let newCardIndex = getIndex(row, col, state.colSize);
            while (cardSlots[newCardIndex]) {
              newCardIndex = getRightIndex(
                newCardIndex,
                state.rowSize,
                state.colSize,
                true
              )!;
            }

            return newCardIndex;
          };
          break;
        default:
          return state;
      }

      const hasAnyMoved = compareReduce(
        (hasAnyMoved, { index, upcomingIndex }) => {
          const hasMoved = mergeCardIfPossible(
            newCardSlots,
            index,
            upcomingIndex
          );
          return hasAnyMoved || hasMoved;
        },
        false
      );

      let nextNewCardValue = state.nextNewCardValue;
      if (hasAnyMoved) {
        const newCardIndex = getNewCardIndex(newCardSlots);
        newCardSlots[newCardIndex] = getNewCard(state.nextNewCardValue);
        nextNewCardValue = pickRandomValue(state.newCardValues);
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        nextNewCardValue,
        isGameEnded,
      };
    }
    default:
      return state;
  }
};

export default reducer;
