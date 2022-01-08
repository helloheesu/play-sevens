import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { generateNewCardId } from './cardAtom';
import Grid from './Grid';
import Modal from './Modal';
import useGridToLine from './useGridToLine';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  const ROW_SIZE = 5;
  const COL_SIZE = 3;
  const {
    generateRandomRowIndex,
    generateRandomColIndex,
    getIndex,
    getRightIndex,
    getLeftIndex,
    getDownIndex,
    getUpIndex,
    getGridIndexFromLineIndex,
    LINE_SIZE,
  } = useGridToLine(ROW_SIZE, COL_SIZE);

  const [cardSlots, setCardSlots] = useState<(ICardInfo | null)[]>([]);

  const getNewCard = (value: number): ICardInfo | null => {
    return {
      id: generateNewCardId(),
      value,
    };
  };

  useEffect(() => {
    const initialCardSlots = new Array(LINE_SIZE);
    const initialCardInfo = { row: 2, col: 1, value: generateRandomNewValue() };
    initialCardSlots[getIndex(initialCardInfo.row, initialCardInfo.col)] =
      getNewCard(initialCardInfo.value);

    setCardSlots(initialCardSlots);
  }, [LINE_SIZE, getIndex]);

  // console.log(
  //   'log',
  //   cardSlots.map((card) => ({ ...card }))
  // );

  const isMergeable = (
    cardA: ICardInfo | null,
    cardB: ICardInfo | null
  ): boolean => {
    if (!cardA || !cardB) {
      return true;
    }

    // console.log(cardA.value, cardB.value, cardA.value + cardB.value);

    if (cardA.value + cardB.value === 3) {
      return true;
    }

    return (cardA.value + cardB.value) % 3 === 0 && cardA.value === cardB.value;
  };

  const [isGameEnded, setIsGameEnded] = useState(false);
  useEffect(() => {
    const isAnyMoveable = (): boolean => {
      for (let row = 0; row < ROW_SIZE; row++) {
        for (let col = 0; col < COL_SIZE; col++) {
          const index = getIndex(row, col);
          const card = cardSlots[index];

          if (!card) {
            console.log('empty moveable', index);

            return true;
          }

          const rightIndex = getRightIndex(row, col);
          if (rightIndex !== null && isMergeable(card, cardSlots[rightIndex])) {
            console.log('right moveable', row, col);

            return true;
          }
          const leftIndex = getLeftIndex(row, col);
          if (leftIndex !== null && isMergeable(card, cardSlots[leftIndex])) {
            console.log('left moveable', row, col);

            return true;
          }
          const downIndex = getDownIndex(row, col);
          if (downIndex !== null && isMergeable(card, cardSlots[downIndex])) {
            console.log('down moveable', row, col);

            return true;
          }
          const upIndex = getUpIndex(row, col);
          if (upIndex !== null && isMergeable(card, cardSlots[upIndex])) {
            console.log('up moveable', row, col);

            return true;
          }
        }
      }
      return false;
    };

    if (isAnyMoveable() === false) {
      console.log('ended');

      setIsGameEnded(true);
    }
  }, [
    cardSlots,
    getDownIndex,
    getIndex,
    getLeftIndex,
    getRightIndex,
    getUpIndex,
  ]);

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
          // console.log('merging', { ...previousCard }, { ...upcomingCard });

          if (isMergeable(previousCard, upcomingCard)) {
            // console.log('mergeable??');

            cardSlots[previousIndex] = {
              ...previousCard,
              value: previousCard.value + upcomingCard.value,
            };
            cardSlots[upcomingIndex] = null;
          } else {
            // console.log('NO');
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
      // console.log('newCard', newCardIndex, {
      //   ...cardSlots[newCardIndex],
      // });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // console.log(e.code);

      switch (e.code) {
        case 'ArrowLeft':
          setCardSlots((cardSlots) => {
            const newCardSlots = [...cardSlots];
            let hasAnyMoved = false;

            for (let col = 0; col <= COL_SIZE - 1; col++) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = getIndex(row, col);
                const rightIndex = getRightIndex(row, col);
                if (rightIndex === null) {
                  continue;
                }

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

            for (let col = COL_SIZE - 1; col >= 0; col--) {
              for (let row = 0; row <= ROW_SIZE - 1; row++) {
                const index = getIndex(row, col);
                const leftIndex = getLeftIndex(row, col);
                if (leftIndex === null) {
                  continue;
                }

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

            for (let row = 0; row <= ROW_SIZE - 1; row++) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = getIndex(row, col);
                const downIndex = getDownIndex(row, col);
                if (downIndex === null) {
                  continue;
                }

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

            for (let row = ROW_SIZE - 1; row >= 0; row--) {
              for (let col = 0; col <= COL_SIZE - 1; col++) {
                const index = getIndex(row, col);
                const upIndex = getUpIndex(row, col);
                if (upIndex === null) {
                  continue;
                }

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
  }, [
    generateRandomColIndex,
    generateRandomRowIndex,
    getDownIndex,
    getIndex,
    getLeftIndex,
    getRightIndex,
    getUpIndex,
  ]);

  const calculateScore = (value: number) => {
    if (value % 3 !== 0) {
      return 0;
    } else {
      const cardScore = Math.pow(3, Math.log2(value / 3) + 1);
      return cardScore;
    }
  };

  const calculateTotalScore = (): number => {
    const totalScore = cardSlots.reduce((score, card) => {
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
      {isGameEnded && <Modal score={calculateTotalScore()} />}
      <Container>
        <Grid>
          {Array.apply(null, Array(ROW_SIZE * COL_SIZE)).map((_, i) => (
            <Cell key={i} />
          ))}
        </Grid>
        <Grid>
          {cardSlots.map((card, index) => {
            const { row, col } = getGridIndexFromLineIndex(index);
            return (
              card && (
                <Card
                  key={card.id}
                  row={row}
                  col={col}
                  value={card.value}
                  score={!isGameEnded ? undefined : calculateScore(card.value)}
                />
              )
            );
          })}
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default App;
