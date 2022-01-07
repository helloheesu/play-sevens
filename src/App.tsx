import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Card from './Card';
import {
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
  row: number;
  col: number;
  toBeMerged: boolean;
}

function App() {
  const { row: ROW_SIZE, col: COL_SIZE } = useRecoilValue(gridSizeState);
  const generateRandomRowIndex = useRecoilValue(generateRandomRowIndexState);
  const generateRandomColIndex = useRecoilValue(generateRandomColIndexState);

  const cardIndex = useRef(0);
  const [cards, setCards] = useState<ICardInfo[]>([]);

  const getNewCard = (
    cards: ICardInfo[],
    row: number,
    col: number
  ): ICardInfo | null => {
    if (cards.some((card) => card.row === row && card.col === col)) {
      return null;
    }

    const newCardIndex = cardIndex.current;
    cardIndex.current = cardIndex.current + 1;

    return {
      id: newCardIndex,
      row,
      col,
      toBeMerged: false,
    };
  };

  useEffect(() => {
    setCards([getNewCard([], 2, 1)!]);
  }, []);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    console.log(e.code);

    switch (e.code) {
      case 'ArrowLeft':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row,
            col: Math.max(0, col - 1),
            toBeMerged: col - 1 < 0,
          }))
        );
        setCards((cards) => [
          ...cards,
          getNewCard(cards, generateRandomRowIndex(), COL_SIZE - 1)!,
        ]);
        break;

      case 'ArrowRight':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row,
            col: Math.min(COL_SIZE - 1, col + 1),
            toBeMerged: col + 1 > COL_SIZE - 1,
          }))
        );
        setCards((cards) => [
          ...cards,
          getNewCard(cards, generateRandomRowIndex(), 0)!,
        ]);
        break;

      case 'ArrowUp':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row: Math.max(0, row - 1),
            col,
            toBeMerged: row - 1 < 0,
          }))
        );
        setCards((cards) => [
          ...cards,
          getNewCard(cards, ROW_SIZE - 1, generateRandomColIndex())!,
        ]);
        break;

      case 'ArrowDown':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row: Math.min(ROW_SIZE - 1, row + 1),
            col,
            toBeMerged: row + 1 > ROW_SIZE - 1,
          }))
        );
        setCards((cards) => [
          ...cards,
          getNewCard(cards, 0, generateRandomColIndex())!,
        ]);
        break;

      default:
        break;
    }
  };

  return (
    <Wrapper onKeyUp={handleKeyUp} tabIndex={0}>
      <Container>
        <Grid>
          {Array.apply(null, Array(ROW_SIZE * COL_SIZE)).map((_, i) => (
            <Cell key={i} />
          ))}
        </Grid>
        <Grid>
          {cards.map(({ id, row, col }) => (
            <Card key={id} row={row} col={col} />
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default App;
