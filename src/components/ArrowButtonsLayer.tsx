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
  box-sizing: border-box;
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 0.5em solid transparent;
    border-bottom: 0.5em solid transparent;
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
    box-sizing: border-box;
    position: relative;
  }
`;
const RightArrow = styled(Arrow)`
  &::after {
    border-left: 1em solid ${(props) => props.theme.black.main};
    left: 0.3em;
  }
`;
const LeftArrow = styled(Arrow)`
  &::after {
    border-right: 1em solid ${(props) => props.theme.black.main};
    right: 0.3em;
  }
`;
const UpArrow = styled(Arrow)`
  &::after {
    border-bottom: 1em solid ${(props) => props.theme.black.main};
    bottom: 0.3em;
  }
`;
const DownArrow = styled(Arrow)`
  &::after {
    border-top: 1em solid ${(props) => props.theme.black.main};
    top: 0.3em;
  }
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
      <RightArrow />
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
      <LeftArrow />
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
      <DownArrow />
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
      <UpArrow />
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
