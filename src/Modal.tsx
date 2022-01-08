import styled from 'styled-components';

const DimmedContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Score = styled.div`
  background-color: white;
  border-radius: 3rem;
  min-width: 20%;
  padding: 3rem;
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
`;

interface Props {
  score: number;
}
const Modal = ({ score }: Props) => {
  return (
    <DimmedContainer>
      <Score>
        <p className="message">Your score is:</p>
        <p className="score">{score}</p>
      </Score>
    </DimmedContainer>
  );
};

export default Modal;
