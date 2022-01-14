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
import reducer from './reducer';
import { getGridIndexFromLineIndex } from './gridToLine';
import defaultTheme from './theme';
import ArrowButtonsLayer from './ArrowButtonsLayer';
import { CELL_GAP_PX, CELL_HEIGHT_PX, CELL_WIDTH_PX } from './consts';

const calculateGridSize = (containerWidth: number, containerHeight: number) => {
  return {
    col: Math.floor(
      (containerWidth - CELL_GAP_PX) / (CELL_WIDTH_PX + CELL_GAP_PX)
    ),
    row: Math.floor(
      (containerHeight - CELL_GAP_PX) / (CELL_HEIGHT_PX + CELL_GAP_PX)
    ),
  };
};

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

const Grid = styled.div<{ row: number; col: number }>`
  display: grid;
  padding: ${CELL_GAP_PX}px;
  gap: ${CELL_GAP_PX}px;
  box-sizing: border-box;
  grid-template: ${(props) =>
    `repeat(${props.row}, minmax(${CELL_HEIGHT_PX}px, auto)) / repeat(${props.col}, minmax(${CELL_WIDTH_PX}px, auto))`};
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
`;
const Cell = styled.div`
  background-color: ${(props) => props.theme.background.darken};
  width: ${CELL_WIDTH_PX}px;
  height: ${CELL_HEIGHT_PX}px;
`;
const NextValueDisplay = styled.div`
  transform: scale(0.7);
  margin-bottom: 1rem;
`;

function App() {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridCol, setGridCol] = useState(0);
  const [gridRow, setGridRow] = useState(0);

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
      const { row, col } = calculateGridSize(
        gridContainerRef.current.clientWidth,
        gridContainerRef.current.clientHeight
      );
      setGridCol(col);
      setGridRow(row);
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
    dispatch({ type: 'changeGridSize', row: gridRow, col: gridCol });
  }, [gridRow, gridCol]);

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
            <Card value={state.nextNewCardValue} />
          </NextValueDisplay>
          {state.isGameEnded && <Modal score={calculateTotalScore()} />}
          <Container ref={gridContainerRef}>
            <Grid row={gridRow} col={gridCol} style={{ position: 'absolute' }}>
              {Array.apply(null, Array(gridRow * gridCol)).map((_, i) => (
                <Cell key={i} />
              ))}
            </Grid>
            <Grid row={gridRow} col={gridCol}>
              {state.cardSlots.map((card, index) => {
                const { row, col } = getGridIndexFromLineIndex(index, gridCol);
                return (
                  card && (
                    <Cell
                      key={card.id}
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
