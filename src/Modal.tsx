import React from 'react';
import styled from 'styled-components';

const DimmedContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  background-color: white;
  border-radius: 3rem;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.6rem;
  color: ${(props) => props.theme.black.main};
`;

interface Props {
  children: React.ReactNode;
}
const Modal = ({ children }: Props) => {
  return (
    <DimmedContainer>
      <Container>{children}</Container>
    </DimmedContainer>
  );
};

export default Modal;
