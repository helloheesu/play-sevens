import { Reducer } from 'react';
import {
  CompareReducer,
  Direction,
  generateRandomColIndex,
  generateRandomRowIndex,
  getCompareReducerFromDown,
  getCompareReducerFromLeft,
  getCompareReducerFromRight,
  getCompareReducerFromUp,
  getDownIndex,
  getIndex,
  getRightIndex,
} from './utils/gridToLine';
import {
  getAllMoveableObj,
  isAnyMoveable,
  IsMoveable,
  isMoveable,
  mergeCardIfPossible,
  updateMoveable,
} from './utils/merge';
import { getInitialCardValues } from './utils/newCardValue';
import {
  DEFAULT_ROW_SIZE,
  DEFAULT_COL_SIZE,
  DEFAULT_UNIT_SIZE,
  WIDTH_RATIO,
  HEIGHT_RATIO,
} from './utils/sizeConsts';

interface CardInfo {
  id: number;
  value: number;
  isMoveable: IsMoveable;
}

export type CardSlot = CardInfo | null;
export interface State {
  rowSize: number;
  colSize: number;
  cardSlots: CardSlot[];
  initialCardCount: number;
  newCardValues: number[];
  isGameEnded: boolean;
  cellWidth: number;
  cellHeight: number;
  cellGap: number;
}

export type Action =
  | {
      type: 'restartGame';
    }
  | {
      type: 'changeSize';
      rowSize?: number;
      colSize?: number;
      cellWidth?: number;
      cellHeight?: number;
      cellGap?: number;
    }
  | { type: 'merge'; direction: Direction };

let newCardId = 0;
const getNewCardId = () => newCardId++;

export const getInitialState = (): State => ({
  rowSize: DEFAULT_ROW_SIZE,
  colSize: DEFAULT_COL_SIZE,
  cardSlots: [],
  initialCardCount: 1,
  newCardValues: getInitialCardValues(),
  isGameEnded: false,
  cellGap: DEFAULT_UNIT_SIZE,
  cellWidth: DEFAULT_UNIT_SIZE * WIDTH_RATIO,
  cellHeight: DEFAULT_UNIT_SIZE * HEIGHT_RATIO,
});

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'restartGame': {
      const initialCardSlots = new Array<CardSlot>(
        state.rowSize * state.colSize
      );
      const newValues = getInitialCardValues();
      const newValue = newValues[0];
      const newIndex = getIndex(2, 1, state.colSize);
      initialCardSlots[newIndex] = {
        value: newValue,
        id: getNewCardId(),
        isMoveable: getAllMoveableObj(),
      };

      return {
        ...state,
        cardSlots: initialCardSlots,
        newCardValues: newValues.slice(1),
        isGameEnded: false,
      };
    }
    case 'changeSize': {
      const { type, ...sizes } = action;
      return {
        ...state,
        ...sizes,
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

      let newCardValues = state.newCardValues.slice(0);
      if (hasAnyMoved) {
        const newCardIndex = getNewCardIndex(newCardSlots);
        newCardSlots[newCardIndex] = {
          value: state.newCardValues[0],
          id: getNewCardId(),
          isMoveable: isMoveable(
            newCardIndex,
            newCardSlots,
            state.rowSize,
            state.colSize
          ),
        };
        updateMoveable(newCardSlots, state.rowSize, state.colSize);

        if (state.newCardValues.length > 1) {
          newCardValues = newCardValues.slice(1);
        } else {
          newCardValues = getInitialCardValues();
        }
      }

      const isGameEnded =
        isAnyMoveable(newCardSlots, state.rowSize, state.colSize) === false;

      return {
        ...state,
        cardSlots: newCardSlots,
        newCardValues,
        isGameEnded,
      };
    }
    default:
      return state;
  }
};

export default reducer;
