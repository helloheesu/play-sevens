import { useEffect, useReducer, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Card from './Card';
import Modal from './Modal';
import reducer from '../reducer';
import { getGridIndexFromLineIndex } from '../gridToLine';
import defaultTheme from '../theme';
import ArrowButtonsLayer from './ArrowButtonsLayer';
import ScoreNameForm from './ScoreNameForm';
import useResponsiveGrid from '../useResponsiveGrid';
import ScoreBoard from './ScoreBoard';
import { ScoreInfo } from '../fbase';

// [NOTE] 100vh doesn't work properly on mobile
interface WrapperProps {
  windowHeight: number;
}
const Wrapper = styled.div<WrapperProps>`
  width: 100vw;
  height: ${(props) => props.windowHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
`;
const GridContainer = styled.div`
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

function App() {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [state, dispatch] = useReducer(reducer, {
    rowSize: 0,
    colSize: 0,
    cardSlots: [],
    initialCardCount: 1,
    newCardValues: [1, 1, 1, 2, 2, 2, 3],
    nextNewCardValue: 0,
    isGameEnded: false,
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { gridRow, gridCol, cellWidth, cellHeight, cellGap } =
    useResponsiveGrid(gridContainerRef, state.isGameEnded === false);

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

  const [isModalOn, setIsModalOn] = useState(false);
  const [isNameFormOn, setIsNameFormOn] = useState(false);
  const [scoreBoardInfo, setScoreBoardInfo] = useState<ScoreInfo>();

  useEffect(() => {
    setIsNameFormOn(state.isGameEnded);
    setIsModalOn(state.isGameEnded);
  }, [state.isGameEnded]);
  const onSubmit = (username: string, score: number) => {
    setIsNameFormOn(false);
    setScoreBoardInfo({ username, score });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Wrapper windowHeight={height}>
        <ArrowButtonsLayer
          onDown={onDown}
          onLeft={onLeft}
          onRight={onRight}
          onUp={onUp}
        >
          <ContentWrapper>
            <NextValueDisplay>
              <Card
                value={state.nextNewCardValue}
                width={cellWidth}
                height={cellHeight}
              />
            </NextValueDisplay>
            {isModalOn && (
              <Modal onClose={() => setIsModalOn(false)}>
                {isNameFormOn && (
                  <ScoreNameForm
                    score={calculateTotalScore()}
                    row={gridRow}
                    col={gridCol}
                    onSubmit={onSubmit}
                  />
                )}
                <ScoreBoard row={gridRow} col={gridCol} {...scoreBoardInfo} />
              </Modal>
            )}
            <GridContainer ref={gridContainerRef}>
              <Grid
                row={gridRow}
                col={gridCol}
                width={cellWidth}
                height={cellHeight}
                gap={cellGap}
                style={{ position: 'absolute' }}
              >
                {Array.apply(null, Array(gridRow * gridCol)).map((_, i) => (
                  <Cell key={i} width={cellWidth} height={cellHeight} />
                ))}
              </Grid>
              <Grid
                row={gridRow}
                col={gridCol}
                width={cellWidth}
                height={cellHeight}
                gap={cellGap}
              >
                {state.cardSlots.map((card, index) => {
                  const { row, col } = getGridIndexFromLineIndex(
                    index,
                    gridCol
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
            </GridContainer>
          </ContentWrapper>
        </ArrowButtonsLayer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
