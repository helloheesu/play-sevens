import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
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
interface ButtonProps {
  onClick?: () => void;
}
const RightButton = ({ onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'right',
      }}
    >
      <Arrow>▶️</Arrow>
    </Container>
  );
};
const LeftButton = ({ onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'left',
      }}
    >
      <Arrow>◀️</Arrow>
    </Container>
  );
};
const DownButton = ({ onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'down',
      }}
    >
      <Arrow>🔽</Arrow>
    </Container>
  );
};
const UpButton = ({ onClick }: ButtonProps) => {
  return (
    <Container
      onClick={onClick}
      style={{
        gridArea: 'up',
      }}
    >
      <Arrow>🔼</Arrow>
    </Container>
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
