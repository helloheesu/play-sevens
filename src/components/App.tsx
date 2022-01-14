import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Card from './Card';
import Modal from './Modal';
import reducer from '../reducer';
import { getGridIndexFromLineIndex } from '../gridToLine';
import defaultTheme from '../theme';
import ArrowButtonsLayer from './ArrowButtonsLayer';
import ScoreNameForm from './ScoreNameForm';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
`;
const Container = styled.div`
  background-color: ${(props) => props.theme.background.main};
  position: relative;
  width: 100%;
  flex-grow: 1;
`;

const Grid = styled.div<{
  row: number;
  col: number;
  gap: number;
  width: number;
  height: number;
}>`
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
const Cell = styled.div<{ width: number; height: number }>`
  background-color: ${(props) => props.theme.background.darken};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;
const NextValueDisplay = styled.div`
  transform: scale(0.7);
  margin-bottom: 1rem;
`;

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
function App() {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{
    gridRow: number;
    gridCol: number;
    scaleUnit: number;
  }>({
    gridRow: 0,
    gridCol: 0,
    scaleUnit: DEFAULT_SCALE_UNIT,
  });

  const [state, dispatch] = useReducer(reducer, {
    rowSize: 0,
    colSize: 0,
    cardSlots: [],
    initialCardCount: 1,
    newCardValues: [1, 1, 1, 2, 2, 2, 3],
    nextNewCardValue: 0,
    isGameEnded: false,
  });

  const onResize = () => {
    if (gridContainerRef && gridContainerRef.current) {
      const { clientWidth, clientHeight } = gridContainerRef.current;
      const scaleUnit =
        clientWidth > 400 && clientHeight > 400
          ? DEFAULT_SCALE_UNIT
          : SMALL_SCALE_UNIT;

      const { row, col } = calculateGridSize(
        clientWidth,
        clientHeight,
        scaleUnit
      );

      setSize({
        gridRow: row,
        gridCol: col,
        scaleUnit,
      });
    }
  };
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useLayoutEffect(() => {
    onResize();
  }, []);
  useEffect(() => {
    dispatch({ type: 'changeGridSize', row: size.gridRow, col: size.gridCol });
  }, [size.gridRow, size.gridCol]);

  useEffect(() => {
    dispatch({ type: 'resetCardSlots' });
  }, []);

  const onLeft = () => dispatch({ type: 'merge', direction: 'left' });
  const onRight = () => dispatch({ type: 'merge', direction: 'right' });
  const onUp = () => dispatch({ type: 'merge', direction: 'up' });
  const onDown = () => dispatch({ type: 'merge', direction: 'down' });

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          onLeft();
          break;
        case 'ArrowRight':
          onRight();
          break;
        case 'ArrowUp':
          onUp();
          break;
        case 'ArrowDown':
          onDown();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const calculateScore = (value: number) => {
    if (value % 3 !== 0) {
      return 0;
    } else {
      const cardScore = Math.pow(3, Math.log2(value / 3) + 1);
      return cardScore;
    }
  };
  const calculateTotalScore = (): number => {
    const totalScore = state.cardSlots.reduce((score, card) => {
      if (!card) {
        return score;
      } else {
        return score + calculateScore(card.value);
      }
    }, 0);

    return totalScore;
  };
  const {
    width: cellWidth,
    height: cellHeight,
    gap: cellGap,
  } = getCellSize(size.scaleUnit);

  return (
    <ThemeProvider theme={defaultTheme}>
      <ArrowButtonsLayer
        onDown={onDown}
        onLeft={onLeft}
        onRight={onRight}
        onUp={onUp}
      >
        <Wrapper>
          <NextValueDisplay>
            <Card
              value={state.nextNewCardValue}
              width={cellWidth}
              height={cellHeight}
            />
          </NextValueDisplay>
          {state.isGameEnded && (
            <Modal>
              <ScoreNameForm
                score={calculateTotalScore()}
                row={size.gridRow}
                col={size.gridCol}
                // [TODO] show scores list from same size
                afterSubmit={() => {}}
              />
            </Modal>
          )}
          <Container ref={gridContainerRef}>
            <Grid
              row={size.gridRow}
              col={size.gridCol}
              width={cellWidth}
              height={cellHeight}
              gap={cellGap}
              style={{ position: 'absolute' }}
            >
              {Array.apply(null, Array(size.gridRow * size.gridCol)).map(
                (_, i) => (
                  <Cell key={i} width={cellWidth} height={cellHeight} />
                )
              )}
            </Grid>
            <Grid
              row={size.gridRow}
              col={size.gridCol}
              width={cellWidth}
              height={cellHeight}
              gap={cellGap}
            >
              {state.cardSlots.map((card, index) => {
                const { row, col } = getGridIndexFromLineIndex(
                  index,
                  size.gridCol
                );
                return (
                  card && (
                    <Cell
                      key={card.id}
                      width={cellWidth}
                      height={cellHeight}
                      style={{
                        gridRow: `${row + 1}/${row + 2}`,
                        gridColumn: `${col + 1}/${col + 2}`,
                      }}
                    >
                      <Card
                        value={card.value}
                        score={
                          !state.isGameEnded
                            ? undefined
                            : calculateScore(card.value)
                        }
                        width={cellWidth}
                        height={cellHeight}
                      />
                    </Cell>
                  )
                );
              })}
            </Grid>
          </Container>
        </Wrapper>
      </ArrowButtonsLayer>
    </ThemeProvider>
  );
}

export default App;
