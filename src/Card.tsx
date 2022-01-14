import styled from 'styled-components';
import { CELL_HEIGHT_PX, CELL_WIDTH_PX } from './consts';
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
}
const Container = styled.div<ContainerProps>`
  width: ${CELL_WIDTH_PX}px;
  height: ${CELL_HEIGHT_PX}px;
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
