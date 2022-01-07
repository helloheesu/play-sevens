import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { gridSizeState } from './cardAtom';

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
}
const Grid = ({ children }: Props) => {
  const { row, col } = useRecoilValue(gridSizeState);

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
