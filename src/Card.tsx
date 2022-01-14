import styled from 'styled-components';
import { ColorKey } from './theme';

const getColors = (
  value: number
): { colorName: ColorKey; fontColor: ColorKey } => {
  switch (value) {
    case 1:
      return { colorName: 'red', fontColor: 'white' };
    case 2:
      return { colorName: 'blue', fontColor: 'white' };
    default:
      return { colorName: 'white', fontColor: 'black' };
  }
};

interface ContainerProps {
  colorName: ColorKey;
  fontColor: ColorKey;
  width: number;
  height: number;
}
const Container = styled.div<ContainerProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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
    color: ${(props) => props.theme[props.fontColor].main};
    opacity: 0.5;
    position: absolute;
    top: 0;
    margin-top: 0.1em;
  }
  .value {
    color: ${(props) => props.theme[props.fontColor].main};
  }
`;

interface Props {
  value: number;
  score?: number;
  width: number;
  height: number;
}
const Card = ({ value, score, width, height }: Props) => {
  const { colorName, fontColor } = getColors(value);
  return (
    <Container
      colorName={colorName}
      fontColor={fontColor}
      width={width}
      height={height}
    >
      {typeof score === 'number' && score > 0 && (
        <p className="score">+{score}</p>
      )}
      <p className="value">{value}</p>
    </Container>
  );
};

export default Card;
