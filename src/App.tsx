import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Card from './Card';
import {
  generateNewCardId,
  generateRandomColIndexState,
  generateRandomRowIndexState,
  gridSizeState,
} from './cardAtom';
import Grid from './Grid';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  box-sizing: border-box;
`;
const Container = styled.div`
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

interface ICardInfo {
  id: number;
  value: number;
}

function App() {
  const { row: ROW_SIZE, col: COL_SIZE } = useRecoilValue(gridSizeState);
  const generateRandomRowIndex = useRecoilValue(generateRandomRowIndexState);
  const generateRandomColIndex = useRecoilValue(generateRandomColIndexState);

  const [cardSlots, setCardSlots] = useState<(ICardInfo | null)[]>([]);

  const getNewCard = (value: number): ICardInfo | null => {
    return {
      id: generateNewCardId(),
      value,
    };
  };

  useEffect(() => {
    const initialCardSlots = new Array(ROW_SIZE * COL_SIZE);
    const initialCardInfo = { row: 2, col: 1, value: 1 };
    initialCardSlots[initialCardInfo.row * COL_SIZE + initialCardInfo.col] =
      getNewCard(initialCardInfo.value);

    setCardSlots(initialCardSlots);
  }, [ROW_SIZE, COL_SIZE]);

  console.log(
    'log',
    cardSlots.map((card) => ({ ...card }))
  );

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      console.log(e.code);

      switch (e.code) {
        case 'ArrowLeft':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            for (let col = 0; col <= COL_SIZE - 2; col++) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = row * COL_SIZE + col;
                const rightIndex = row * COL_SIZE + col + 1;

                const previousCard = newCardSlots[index];
                const upcomingCard = newCardSlots[rightIndex];

                if (upcomingCard) {
                  if (previousCard) {
                    console.log(
                      'merging',
                      { ...previousCard },
                      { ...upcomingCard }
                    );

                    if (true) {
                      // mergeable
                      newCardSlots[index] = {
                        ...previousCard,
                        value: previousCard.value + upcomingCard.value,
                      };
                      newCardSlots[rightIndex] = null;
                    }
                  } else {
                    console.log('moving', previousCard, upcomingCard);
                    newCardSlots[index] = upcomingCard;
                    newCardSlots[rightIndex] = null;
                  }
                }
              }
            }

            const newCardIndex =
              generateRandomRowIndex() * COL_SIZE + COL_SIZE - 1;
            newCardSlots[newCardIndex] = getNewCard(1);
            console.log('newCard', newCardIndex, {
              ...newCardSlots[newCardIndex],
            });

            return newCardSlots;
          });

          break;

        case 'ArrowRight':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            for (let col = COL_SIZE - 1; col >= 1; col--) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = row * COL_SIZE + col;
                const leftIndex = row * COL_SIZE + col - 1;

                const previousCard = newCardSlots[index];
                const upcomingCard = newCardSlots[leftIndex];

                if (upcomingCard) {
                  if (previousCard) {
                    console.log(
                      'merging',
                      { ...previousCard },
                      { ...upcomingCard }
                    );

                    if (true) {
                      // mergeable
                      newCardSlots[index] = {
                        ...previousCard,
                        value: previousCard.value + upcomingCard.value,
                      };
                      newCardSlots[leftIndex] = null;
                    }
                  } else {
                    console.log('moving', previousCard, upcomingCard);
                    newCardSlots[index] = upcomingCard;
                    newCardSlots[leftIndex] = null;
                  }
                }
              }
            }

            const newCardIndex = generateRandomRowIndex() * COL_SIZE + 0;
            newCardSlots[newCardIndex] = getNewCard(1);
            console.log('newCard', newCardIndex, {
              ...newCardSlots[newCardIndex],
            });

            return newCardSlots;
          });
          break;

        case 'ArrowUp':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            for (let row = 0; row <= ROW_SIZE - 2; row++) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = row * COL_SIZE + col;
                const downIndex = (row + 1) * COL_SIZE + col;

                const previousCard = newCardSlots[index];
                const upcomingCard = newCardSlots[downIndex];

                if (upcomingCard) {
                  if (previousCard) {
                    console.log(
                      'merging',
                      { ...previousCard },
                      { ...upcomingCard }
                    );

                    if (true) {
                      // mergeable
                      newCardSlots[index] = {
                        ...previousCard,
                        value: previousCard.value + upcomingCard.value,
                      };
                      newCardSlots[downIndex] = null;
                    }
                  } else {
                    console.log('moving', previousCard, upcomingCard);
                    newCardSlots[index] = upcomingCard;
                    newCardSlots[downIndex] = null;
                  }
                }
              }
            }

            const newCardIndex =
              (ROW_SIZE - 1) * COL_SIZE + generateRandomColIndex();
            newCardSlots[newCardIndex] = getNewCard(1);
            console.log('newCard', newCardIndex, {
              ...newCardSlots[newCardIndex],
            });

            return newCardSlots;
          });
          break;

        case 'ArrowDown':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            for (let row = ROW_SIZE - 1; row >= 1; row--) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = row * COL_SIZE + col;
                const upIndex = (row - 1) * COL_SIZE + col;

                const previousCard = newCardSlots[index];
                const upcomingCard = newCardSlots[upIndex];

                if (upcomingCard) {
                  if (previousCard) {
                    console.log(
                      'merging',
                      { ...previousCard },
                      { ...upcomingCard }
                    );

                    if (true) {
                      // mergeable
                      newCardSlots[index] = {
                        ...previousCard,
                        value: previousCard.value + upcomingCard.value,
                      };
                      newCardSlots[upIndex] = null;
                    }
                  } else {
                    console.log('moving', previousCard, upcomingCard);
                    newCardSlots[index] = upcomingCard;
                    newCardSlots[upIndex] = null;
                  }
                }
              }
            }

            const newCardIndex = 0 * COL_SIZE + generateRandomColIndex();
            newCardSlots[newCardIndex] = getNewCard(1);
            console.log('newCard', newCardIndex, {
              ...newCardSlots[newCardIndex],
            });

            return newCardSlots;
          });
          break;

        default:
          break;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [COL_SIZE, ROW_SIZE, generateRandomColIndex, generateRandomRowIndex]);

  return (
    <Wrapper>
      <Container>
        <Grid>
          {Array.apply(null, Array(ROW_SIZE * COL_SIZE)).map((_, i) => (
            <Cell key={i} />
          ))}
        </Grid>
        <Grid>
          {cardSlots.map(
            (card, index) =>
              card && (
                <Card
                  key={card.id}
                  row={Math.floor(index / COL_SIZE)}
                  col={index % COL_SIZE}
                  value={card.value}
                />
              )
          )}
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default App;
