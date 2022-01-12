import { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import Card from './Card';
import Grid from './Grid';
import Modal from './Modal';
import reducer from './reducer';
import { getGridIndexFromLineIndex } from './gridToLine';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const NewValueDisplay = styled.div`
  padding: 1em;
  border-radius: 0.5rem;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
    rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
`;
const Container = styled.div`
  margin: 2em;
  background-color: #eee;
  min-width: 300px;
  min-height: 450px;
  max-width: 900px;
  max-height: 1350px;
  height: 80%;
  width: 80%;
  position: relative;
`;

const Cell = styled.div`
  background-color: darkgray;
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
    <Wrapper>
      <NewValueDisplay>{state.nextNewCardValue}</NewValueDisplay>
      {state.isGameEnded && <Modal score={calculateTotalScore()} />}
      <Container>
        <Grid row={ROW_SIZE} col={COL_SIZE}>
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
  );
}

export default App;
