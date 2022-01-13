import styled from 'styled-components';
import { ColorKeys, Colors } from './theme';

const getColors = (value: number) => {
  switch (value) {
    case 1:
      return { colorName: Colors.red, fontColor: Colors.white };
    case 2:
      return { colorName: Colors.blue, fontColor: Colors.white };
    default:
      return { colorName: Colors.white, fontColor: Colors.black };
  }
};

interface ContainerProps {
  colorName: ColorKeys;
  fontColor: ColorKeys;
}
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;

  position: relative;
  top: -0.1em;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme[props.colorName].main};
  box-shadow: 0 0.3rem 0 0 ${(props) => props.theme[props.colorName].darken};
  p {
    margin: 0;
  }
  .score {
    font-size: 0.5em;
    color: darkgray;
    position: absolute;
    top: 5%;
  }
  .value {
    color: ${(props) => props.theme[props.fontColor].main};
  }
`;

interface Props {
  value: number;
  score?: number;
}
const Card = ({ value, score }: Props) => {
  const { colorName, fontColor } = getColors(value);
  return (
    <Container colorName={colorName} fontColor={fontColor}>
      {typeof score === 'number' && score > 0 && (
        <p className="score">+{score}</p>
      )}
      <p className="value">{value}</p>
    </Container>
  );
};

export default Card;
