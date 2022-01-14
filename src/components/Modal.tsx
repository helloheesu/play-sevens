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
const TextButton = styled.button`
  margin-top: 1em;
  background: none;
  border: none;
  outline: none;
  color: ${(props) => props.theme.background.darken};
`;

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}
const Modal = ({ children, onClose }: Props) => {
  return (
    <DimmedContainer>
      <Container>
        {children}
        <TextButton onClick={onClose}>close</TextButton>
      </Container>
    </DimmedContainer>
  );
};

export default Modal;
