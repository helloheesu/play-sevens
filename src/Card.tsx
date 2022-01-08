import styled from 'styled-components';

const COLOR_PALETTE = [
  // https://colorhunt.co/palette/d9d7f1fffddee7fbbeffcbcb
  '#FFCBCB',
  '#E7FBBE',
  '#FFFDDE',
  '#D9D7F1',
];

const getColorIndex = (value: number) => {
  switch (value) {
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return 2;
  }
};

interface ContainerProps {
  colorIndex: number;
  row: number;
  col: number;
}
const Container = styled.div<ContainerProps>`
  background-color: pink;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.2rem;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: ${(props) => COLOR_PALETTE[props.colorIndex]};
  grid-row: ${(props) => `${props.row + 1}/${props.row + 2}`};
  grid-column: ${(props) => `${props.col + 1}/${props.col + 2}`};
  position: relative;

  p {
    margin: 0;
  }
  .score {
    font-size: 0.7em;
    color: darkgray;
    position: absolute;
    top: 20%;
  }
`;

interface Props {
  row: number;
  col: number;
  value: number;
  score?: number;
}
const Card = ({ row, col, value, score }: Props) => {
  return (
    <Container colorIndex={getColorIndex(value)} row={row} col={col} style={{}}>
      {typeof score === 'number' && score > 0 && (
        <p className="score">+{score}</p>
      )}
      <p className="value">{value}</p>
    </Container>
  );
};

export default Card;
