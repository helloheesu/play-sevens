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
  value: number;
  score?: number;
}
const Card = ({ value, score }: Props) => {
  return (
    <Container colorIndex={getColorIndex(value)}>
      {typeof score === 'number' && score > 0 && (
        <p className="score">+{score}</p>
      )}
      <p className="value">{value}</p>
    </Container>
  );
};

export default Card;
