import { useEffect, useState } from 'react';

const DEFAULT_SCALE_UNIT = 16;
const WIDTH_RATIO = 3;
const HEIGHT_RATIO = 4;
const GAP_RATIO = 1;
const calculateScale = (
  containerWidth: number,
  containerHeight: number,
  rowSize: number,
  colSize: number
) => {
  const widthScale =
    containerWidth / ((GAP_RATIO + WIDTH_RATIO) * colSize + GAP_RATIO);
  const heightScale =
    containerHeight / ((GAP_RATIO + HEIGHT_RATIO) * rowSize + GAP_RATIO);
  return Math.min(widthScale, heightScale);
};

const useResponsiveCell = (
  containerRef: React.RefObject<HTMLDivElement>,
  rowSize: number,
  colSize: number
) => {
  const [scaleUnit, setScaleUnit] = useState(DEFAULT_SCALE_UNIT);
  useEffect(() => {
    if (!containerRef?.current) {
      return;
    }
    const onResize = () => {
      if (containerRef && containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const scaleUnit = calculateScale(
          clientWidth,
          clientHeight,
          rowSize,
          colSize
        );
        setScaleUnit(scaleUnit);
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [containerRef, colSize, rowSize]);

  return {
    cellWidth: scaleUnit * WIDTH_RATIO,
    cellHeight: scaleUnit * HEIGHT_RATIO,
    cellGap: scaleUnit * GAP_RATIO,
  };
};

export default useResponsiveCell;
