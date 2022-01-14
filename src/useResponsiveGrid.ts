import { useEffect, useState } from 'react';

const DEFAULT_SCALE_UNIT = 16;
const SMALL_SCALE_UNIT = 12;
const getCellSize = (scaleUnit: number) => {
  return {
    gap: scaleUnit,
    width: scaleUnit * 3,
    height: scaleUnit * 4,
  };
};
const calculateGridSize = (
  containerWidth: number,
  containerHeight: number,
  scaleUnit: number
) => {
  const { width, height, gap } = getCellSize(scaleUnit);
  return {
    col: Math.floor((containerWidth - gap) / (width + gap)),
    row: Math.floor((containerHeight - gap) / (height + gap)),
  };
};

const useResponsiveGrid = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [gridRow, setGridRow] = useState(0);
  const [gridCol, setGridCol] = useState(0);
  const [scaleUnit, setScaleUnit] = useState(DEFAULT_SCALE_UNIT);

  useEffect(() => {
    const ref = containerRef?.current;
    if (ref) {
      const onResize = () => {
        if (containerRef && containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          const scaleUnit =
            clientWidth > 400 && clientHeight > 400
              ? DEFAULT_SCALE_UNIT
              : SMALL_SCALE_UNIT;

          const { row, col } = calculateGridSize(
            clientWidth,
            clientHeight,
            scaleUnit
          );
          setGridRow(row);
          setGridCol(col);
          setScaleUnit(scaleUnit);
        }
      };

      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [containerRef]);

  const {
    width: cellWidth,
    height: cellHeight,
    gap: cellGap,
  } = getCellSize(scaleUnit);

  return { gridRow, gridCol, scaleUnit, cellWidth, cellHeight, cellGap };
};

export default useResponsiveGrid;
