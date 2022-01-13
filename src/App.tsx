import { useEffect, useReducer } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Card from './Card';
import Modal from './Modal';
import reducer from './reducer';
import { getGridIndexFromLineIndex } from './gridToLine';
import defaultTheme from './theme';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Container = styled.div`
  margin: 2em;
  background-color: ${(props) => props.theme.background.main};
  position: relative;
`;

const Grid = styled.div<{ row: number; col: number }>`
  display: grid;
  padding: 1em;
  gap: 1em;
  box-sizing: border-box;
  grid-template: ${(props) =>
    `repeat(${props.row}, 1fr) / repeat(${props.col}, 1fr)`};
`;
const Cell = styled.div`
  background-color: ${(props) => props.theme.background.darken};
  width: 3rem;
  height: 4rem;
`;

function App() {
  const ROW_SIZE = 5;
  const COL_SIZE = 3;
  const [state, dispatch] = useReducer(reducer, {
    rowSize: ROW_SIZE,
    colSize: COL_SIZE,
    cardSlots: [],
    initialCardCount: 1,
    newCardValues: [1, 1, 1, 2, 2, 2, 3],
    nextNewCardValue: 0,
    isGameEnded: false,
  });

  useEffect(() => {
    dispatch({ type: 'resetCardSlots' });
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      // console.log(e.code);

      switch (e.code) {
        case 'ArrowLeft':
          dispatch({ type: 'mergeLeft' });
          break;

        case 'ArrowRight':
          dispatch({ type: 'mergeRight' });
          break;

        case 'ArrowUp':
          dispatch({ type: 'mergeUp' });
          break;

        case 'ArrowDown':
          dispatch({ type: 'mergeDown' });
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
      <Wrapper>
        <Cell style={{ transform: 'scale(0.7)' }}>
          <Card value={state.nextNewCardValue} />
        </Cell>
        {state.isGameEnded && <Modal score={calculateTotalScore()} />}
        <Container>
          <Grid row={ROW_SIZE} col={COL_SIZE} style={{ position: 'absolute' }}>
            {Array.apply(null, Array(ROW_SIZE * COL_SIZE)).map((_, i) => (
              <Cell key={i} />
            ))}
          </Grid>
          <Grid row={ROW_SIZE} col={COL_SIZE}>
            {state.cardSlots.map((card, index) => {
              const { row, col } = getGridIndexFromLineIndex(index, COL_SIZE);
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
    </ThemeProvider>
  );
}

export default App;
