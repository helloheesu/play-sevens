import React, { useState } from 'react';
import styled from 'styled-components';
import Card from './Card';

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

const ROW_SIZE = 4;
const COL_SIZE = 3;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${ROW_SIZE}, 1fr);
  grid-template-columns: repeat(${COL_SIZE}, 1fr);
  width: 100%;
  height: 100%;
  padding: 1em;
  gap: 1em;
  box-sizing: border-box;
  position: absolute;
`;
const Cell = styled.div`
  background-color: darkgray;
`;

type CardInfo = {
  id: number;
  row: number;
  col: number;
};

function App() {
  const [cards, setCards] = useState<CardInfo[]>([{ id: 0, row: 2, col: 1 }]);
  const handleKeyUp = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row,
            col: Math.max(0, col - 1),
          }))
        );
        break;
      case 'ArrowRight':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row,
            col: Math.min(COL_SIZE - 1, col + 1),
          }))
        );
        break;
      case 'ArrowUp':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row: Math.max(0, row - 1),
            col,
          }))
        );
        break;
      case 'ArrowDown':
        setCards((cards) =>
          cards.map(({ id, row, col }) => ({
            id,
            row: Math.min(ROW_SIZE - 1, row + 1),
            col,
          }))
        );
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
