import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 15% minmax(0, 1fr) 15%;
  grid-template-columns: 15% minmax(0, 1fr) 15%;
  grid-template-areas:
    '.     up      .    '
    'left  center  right'
    '.     down    .    ';
`;
const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const Arrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme.background.main};
`;
type ButtonProps = React.HTMLProps<HTMLDivElement>;
const RightButton = ({ style, onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'right',
        ...style,
      }}
    >
      <Arrow>&#9654;</Arrow>
    </Container>
  );
};
const LeftButton = ({ onClick }: ButtonProps) => {
  return (
    <RightButton
      onClick={onClick}
      style={{ transform: 'rotate(180deg)', gridArea: 'left' }}
    />
  );
};
const DownButton = ({ style, onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'down',
        ...style,
      }}
    >
      <Arrow>&#9660;</Arrow>
    </Container>
  );
};
const UpButton = ({ onClick }: ButtonProps) => {
  return (
    <DownButton
      onClick={onClick}
      style={{ transform: 'rotate(180deg)', gridArea: 'up' }}
    />
  );
};

const Center = styled.div`
  grid-area: center;
`;

interface Props {
  onUp?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  children: React.ReactNode;
}
const ArrowButtonsLayer = ({
  children,
  onUp,
  onLeft,
  onRight,
  onDown,
}: Props) => {
  return (
    <Wrapper>
      <UpButton onClick={onUp} />
      <LeftButton onClick={onLeft} />
      <RightButton onClick={onRight} />
      <DownButton onClick={onDown} />
      <Center>{children}</Center>
    </Wrapper>
  );
};

export default ArrowButtonsLayer;
