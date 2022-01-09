import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  padding: 1em;
  gap: 1em;
  box-sizing: border-box;
  position: absolute;
`;

interface Props {
  children: React.ReactNode;
  row: number;
  col: number;
}
const Grid = ({ children, row, col }: Props) => {
  return (
    <Container
      style={{
        gridTemplate: `repeat(${row}, 1fr) / repeat(${col}, 1fr)`,
      }}
    >
      {children}
    </Container>
  );
};

export default Grid;
