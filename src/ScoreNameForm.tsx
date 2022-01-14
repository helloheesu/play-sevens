import styled from 'styled-components';
import Form from './Form';
import Score, { Props as ScoreProps } from './Score';
import { scoresRef } from './fbase';
import { addDoc } from 'firebase/firestore';

const Container = styled.div``;

interface Props extends ScoreProps {
  afterSubmit: () => void;
}
const ScoreNameForm = ({ score, row, col, afterSubmit }: Props) => {
  const handleSubmit = async (username: string) => {
    console.log('app', username, score, row, col);

    await addDoc(scoresRef, {
      username,
      score,
      row,
      col,
    });

    afterSubmit();
  };
  return (
    <Container>
      <Score score={score} row={row} col={col} />
      <Form onSubmit={handleSubmit} />
    </Container>
  );
};

export default ScoreNameForm;
