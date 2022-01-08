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

const NEW_CARD_VALUES = [1, 1, 1, 2, 2, 2, 3];
const generateRandomNewValue = () => {
  const randomIndex = Math.floor(Math.random() * NEW_CARD_VALUES.length);
  return NEW_CARD_VALUES[randomIndex];
};

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
    const initialCardInfo = { row: 2, col: 1, value: generateRandomNewValue() };
    initialCardSlots[initialCardInfo.row * COL_SIZE + initialCardInfo.col] =
      getNewCard(initialCardInfo.value);

    setCardSlots(initialCardSlots);
  }, [ROW_SIZE, COL_SIZE]);

  // console.log(
  //   'log',
  //   cardSlots.map((card) => ({ ...card }))
  // );

  const isMergeable = (cardA: ICardInfo, cardB: ICardInfo): boolean => {
    console.log(cardA.value, cardB.value, cardA.value + cardB.value);

    if (cardA.value + cardB.value === 3) {
      return true;
    }

    return (cardA.value + cardB.value) % 3 === 0 && cardA.value === cardB.value;
  };

  useEffect(() => {
    const mergeCardIfPossible = (
      cardSlots: (ICardInfo | null)[],
      previousIndex: number,
      upcomingIndex: number
    ): boolean => {
      const previousCard = cardSlots[previousIndex];
      const upcomingCard = cardSlots[upcomingIndex];

      if (upcomingCard) {
        if (previousCard) {
          console.log('merging', { ...previousCard }, { ...upcomingCard });

          if (isMergeable(previousCard, upcomingCard)) {
            console.log('mergeable??');

            cardSlots[previousIndex] = {
              ...previousCard,
              value: previousCard.value + upcomingCard.value,
            };
            cardSlots[upcomingIndex] = null;
          } else {
            console.log('NO');
            // do nothing
            return false;
          }
        } else {
          // console.log('moving', previousCard, upcomingCard);
          cardSlots[previousIndex] = upcomingCard;
          cardSlots[upcomingIndex] = null;
        }
        return true;
      }
      return false;
    };

    const generateNewCard = (
      cardSlots: (ICardInfo | null)[],
      getNextIndex: () => number
    ) => {
      let newCardIndex;
      do {
        newCardIndex = getNextIndex();
      } while (cardSlots[newCardIndex]);

      cardSlots[newCardIndex] = getNewCard(generateRandomNewValue());
      console.log('newCard', newCardIndex, {
        ...cardSlots[newCardIndex],
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // console.log(e.code);

      switch (e.code) {
        case 'ArrowLeft':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            let hasAnyMoved = false;

            for (let col = 0; col <= COL_SIZE - 2; col++) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = row * COL_SIZE + col;
                const rightIndex = row * COL_SIZE + col + 1;

                const hasMoved = mergeCardIfPossible(
                  newCardSlots,
                  index,
                  rightIndex
                );
                hasAnyMoved = hasAnyMoved || hasMoved;
              }
            }

            if (hasAnyMoved) {
              let rowIndex = generateRandomRowIndex();
              const getNextIndex = () => {
                const newCardIndex = rowIndex * COL_SIZE + COL_SIZE - 1;
                rowIndex = (rowIndex + 1) % ROW_SIZE;
                return newCardIndex;
              };
              generateNewCard(newCardSlots, getNextIndex);
            }

            return newCardSlots;
          });

          break;

        case 'ArrowRight':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            let hasAnyMoved = false;

            for (let col = COL_SIZE - 1; col >= 1; col--) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = row * COL_SIZE + col;
                const leftIndex = row * COL_SIZE + col - 1;

                const hasMoved = mergeCardIfPossible(
                  newCardSlots,
                  index,
                  leftIndex
                );
                hasAnyMoved = hasAnyMoved || hasMoved;
              }
            }

            if (hasAnyMoved) {
              let rowIndex = generateRandomRowIndex();
              const getNextIndex = () => {
                const newCardIndex = rowIndex * COL_SIZE + 0;
                rowIndex = (rowIndex + 1) % ROW_SIZE;
                return newCardIndex;
              };
              generateNewCard(newCardSlots, getNextIndex);
            }

            return newCardSlots;
          });
          break;

        case 'ArrowUp':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            let hasAnyMoved = false;

            for (let row = 0; row <= ROW_SIZE - 2; row++) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = row * COL_SIZE + col;
                const downIndex = (row + 1) * COL_SIZE + col;

                const hasMoved = mergeCardIfPossible(
                  newCardSlots,
                  index,
                  downIndex
                );
                hasAnyMoved = hasAnyMoved || hasMoved;
              }
            }

            if (hasAnyMoved) {
              let colIndex = generateRandomColIndex();
              const getNextIndex = () => {
                const newCardIndex = (ROW_SIZE - 1) * COL_SIZE + colIndex;
                colIndex = (colIndex + 1) % COL_SIZE;
                return newCardIndex;
              };
              generateNewCard(newCardSlots, getNextIndex);
            }

            return newCardSlots;
          });
          break;

        case 'ArrowDown':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            let hasAnyMoved = false;

            for (let row = ROW_SIZE - 1; row >= 1; row--) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = row * COL_SIZE + col;
                const upIndex = (row - 1) * COL_SIZE + col;

                const hasMoved = mergeCardIfPossible(
                  newCardSlots,
                  index,
                  upIndex
                );
                hasAnyMoved = hasAnyMoved || hasMoved;
              }
            }

            if (hasAnyMoved) {
              let colIndex = generateRandomColIndex();
              const getNextIndex = () => {
                const newCardIndex = 0 * COL_SIZE + colIndex;
                colIndex = (colIndex + 1) % COL_SIZE;
                return newCardIndex;
              };
              generateNewCard(newCardSlots, getNextIndex);
            }

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
