import styled from 'styled-components';

const Container = styled.div`
  min-width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .score {
    margin-top: 0.5em;
    .message {
      font-size: 0.8em;
    }
  }
  .size {
    font-size: 0.6em;
    margin-top: 1em;
    color: ${(props) => props.theme.background.darken};
  }
`;
interface Props {
  score: number;
  row: number;
  col: number;
}
const Score = ({ score, row, col }: Props) => {
  return (
    <Container>
      <p className="score">
        <span className="message">Your scored: </span>
        <span>{score}</span>
      </p>
      <p className="size">
        In {row}X{col}
      </p>
    </Container>
  );
};

export default Score;
