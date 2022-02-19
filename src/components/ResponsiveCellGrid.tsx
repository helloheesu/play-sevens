import { useEffect } from 'react';
import styled from 'styled-components';
import { Direction, getGridIndexFromLineIndex } from '../utils/gridToLine';
import { Action, State } from '../reducer';
import useResponsiveCell from '../hooks/useResponsiveCell';
import { calculateScore } from '../utils/value';
import Card from './Card';

const Grid = styled.div<{
  row: number;
  col: number;
  gap: number;
  width: number;
  height: number;
}>`
  background-color: ${(props) => props.theme.background.main};
  display: grid;
  padding: ${(props) => props.gap}px;
  gap: ${(props) => props.gap}px;
  box-sizing: border-box;
  grid-template: ${(props) =>
    `repeat(${props.row}, minmax(${props.height}px, auto)) / repeat(${props.col}, minmax(${props.width}px, auto))`};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
`;
const EmptyCell = styled.div<{ width: number; height: number }>`
  background-color: ${(props) => props.theme.background.darken};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

interface Props {
  state: State;
  dispatch: (value: Action) => void;
  gridContainerRef: React.RefObject<HTMLDivElement>;
  isMoving: boolean;
  direction?: Direction;
  deltaX: number;
  deltaY: number;
  isAnimating: boolean;
}
const ResponsiveCellGrid = ({
  state,
  dispatch,
  gridContainerRef,
  isMoving,
  direction,
  deltaX,
  deltaY,
  isAnimating,
}: Props) => {
  const { cellWidth, cellHeight, cellGap } = useResponsiveCell(
    gridContainerRef,
    state.rowSize,
    state.colSize
  );

  useEffect(() => {
    dispatch({ type: 'changeSize', cellWidth, cellHeight, cellGap });
  }, [cellGap, cellHeight, cellWidth, dispatch]);

  return (
    <>
      <Grid
        row={state.rowSize}
        col={state.colSize}
        width={cellWidth}
        height={cellHeight}
        gap={cellGap}
      >
        {Array.apply(null, Array(state.rowSize * state.colSize)).map((_, i) => {
          const { row, col } = getGridIndexFromLineIndex(i, state.colSize);
          return (
            <EmptyCell
              key={i}
              width={cellWidth}
              height={cellHeight - 5}
              style={{
                gridRow: `${row + 1}/${row + 2}`,
                gridColumn: `${col + 1}/${col + 2}`,
              }}
            >
              {process.env.REACT_APP_DEBUG_MOVEABLE === 'true' && i}
            </EmptyCell>
          );
        })}
        {state.cardSlots.map((card, index) => {
          const { row, col } = getGridIndexFromLineIndex(index, state.colSize);
          return (
            card && (
              <Card
                key={card.id}
                style={{
                  gridRow: `${row + 1}/${row + 2}`,
                  gridColumn: `${col + 1}/${col + 2}`,
                  marginTop: `-5px`,
                }}
                value={card.value}
                score={
                  !state.isGameEnded ? undefined : calculateScore(card.value)
                }
                width={cellWidth}
                height={cellHeight}
                gap={cellGap}
                isMoveable={card.isMoveable}
                isMoving={isMoving}
                direction={direction}
                deltaX={deltaX}
                deltaY={deltaY}
                isAnimating={isAnimating}
              />
            )
          );
        })}
      </Grid>
    </>
  );
};

export default ResponsiveCellGrid;
