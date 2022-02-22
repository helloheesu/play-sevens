import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getGridIndexFromLineIndex } from '../utils/gridToLine';
import useContainerSize from 'hooks/useContainerSize';
import {
  GAP_RATIO,
  WIDTH_RATIO,
  HEIGHT_RATIO,
  DEFAULT_SCALE_UNIT,
} from 'utils/sizeConsts';
import { atom, useRecoilState } from 'recoil';

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

  return Math.min(widthScale, heightScale);
};

export const cellSizeState = atom({
  key: 'cellSize',
  default: {
    cellWidth: DEFAULT_SCALE_UNIT * WIDTH_RATIO,
    cellHeight: DEFAULT_SCALE_UNIT * HEIGHT_RATIO,
    cellGap: DEFAULT_SCALE_UNIT,
  },
});

interface Props {
  rowSize: number;
  colSize: number;
  children: React.ReactNode;
}
const ResponsiveCellGrid = ({ rowSize, colSize, children }: Props) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(gridContainerRef);
  const [{ cellWidth, cellHeight }, setCellSize] =
    useRecoilState(cellSizeState);

  useEffect(() => {
    const scaleUnit = calculateScale(width, height, rowSize, colSize);
    const cellWidth = scaleUnit * WIDTH_RATIO;
    const cellHeight = scaleUnit * HEIGHT_RATIO;

    setCellSize({ cellWidth, cellHeight, cellGap: scaleUnit });
  }, [height, setCellSize, colSize, rowSize, width]);

  return (
    <Grid
      ref={gridContainerRef}
      row={rowSize}
      col={colSize}
      width={cellWidth}
      height={cellHeight}
    >
      {Array.apply(null, Array(rowSize * colSize)).map((_, i) => {
        const { row, col } = getGridIndexFromLineIndex(i, colSize);
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
