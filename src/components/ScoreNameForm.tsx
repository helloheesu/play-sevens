import styled from 'styled-components';
import NameForm from './NameForm';
import Score, { Props as ScoreProps } from './Score';
import { addScore } from '../fbase';

const Container = styled.div``;

interface Props extends ScoreProps {
  afterSubmit: () => void;
}
const ScoreNameForm = ({ score, row, col, afterSubmit }: Props) => {
  const handleSubmit = async (username: string) => {
    await addScore(username, score, row, col);
    afterSubmit();
  };
  return (
    <Container>
      <Score score={score} row={row} col={col} />
      <NameForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default ScoreNameForm;
