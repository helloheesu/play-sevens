import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getGridIndexFromLineIndex } from '../utils/gridToLine';
import { Action, State } from '../reducer';
import useContainerSize from 'hooks/useContainerSize';
import {
  GAP_RATIO,
  WIDTH_RATIO,
  HEIGHT_RATIO,
  DEFAULT_SCALE_UNIT,
} from 'utils/sizeConsts';

const Grid = styled.div<{
  row: number;
  col: number;
  width: number;
  height: number;
}>`
  background-color: ${(props) => props.theme.background.main};
  display: grid;
  grid-template: ${(props) =>
    `repeat(${props.row}, minmax(${props.height}px, auto)) / repeat(${props.col}, minmax(${props.width}px, auto))`};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  align-content: space-around;
  justify-content: space-around;
`;
const EmptyCell = styled.div<{ width: number; height: number }>`
  background-color: ${(props) => props.theme.background.darken};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const calculateScale = (
  containerWidth: number,
  containerHeight: number,
  rowSize: number,
  colSize: number
) => {
  const widthScale = containerWidth / ((GAP_RATIO + WIDTH_RATIO) * colSize);
  const heightScale = containerHeight / ((GAP_RATIO + HEIGHT_RATIO) * rowSize);
  console.log(containerWidth, containerHeight, widthScale, heightScale);

  return Math.min(widthScale, heightScale);
};

interface Props {
  state: State;
  dispatch: (value: Action) => void;
  children: React.ReactNode;
}
const ResponsiveCellGrid = ({ state, dispatch, children }: Props) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(gridContainerRef);
  const [{ cellWidth, cellHeight }, setCellSize] = useState({
    cellWidth: DEFAULT_SCALE_UNIT * WIDTH_RATIO,
    cellHeight: DEFAULT_SCALE_UNIT * HEIGHT_RATIO,
  });

  useEffect(() => {
    const scaleUnit = calculateScale(
      width,
      height,
      state.rowSize,
      state.colSize
    );
    const cellWidth = scaleUnit * WIDTH_RATIO;
    const cellHeight = scaleUnit * HEIGHT_RATIO;

    setCellSize({ cellWidth, cellHeight });
    dispatch({ type: 'changeSize', cellWidth, cellHeight });
  }, [width, height, state.colSize, state.rowSize, dispatch]);

  return (
    <Grid
      ref={gridContainerRef}
      row={state.rowSize}
      col={state.colSize}
      width={cellWidth}
      height={cellHeight}
    >
      {Array.apply(null, Array(state.rowSize * state.colSize)).map((_, i) => {
        const { row, col } = getGridIndexFromLineIndex(i, state.colSize);
        return (
          <EmptyCell
            key={i}
            width={cellWidth}
            height={cellHeight}
            style={{
              gridRow: `${row + 1}/${row + 2}`,
              gridColumn: `${col + 1}/${col + 2}`,
            }}
          >
            {process.env.REACT_APP_DEBUG_MOVEABLE === 'true' && i}
          </EmptyCell>
        );
      })}
      {children}
    </Grid>
  );
};

export default ResponsiveCellGrid;
