import styled from 'styled-components';

const Container = styled.div`
  min-width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p {
    margin: 0;
  }
  .message {
    font-size: 1.6rem;
  }
  .score {
    font-size: 3rem;
    margin-top: 0.5em;
  }
  .size {
    font-family: Arial, Helvetica, sans-serif;
    margin-top: 1em;
    opacity: 0.5;
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
      <p className="message">Your score is:</p>
      <p className="score">{score}</p>
      <p className="size">
        In {row}X{col}
      </p>
    </Container>
  );
};

export default Score;
