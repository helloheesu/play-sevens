import { useEffect } from 'react';

interface Props {
  isOn: boolean;
}

const ScoreBoard = ({ isOn }: Props) => {
  useEffect(() => {
    // [TODO] score list request
    setTimeout(() => console.log('done!'), 3000);
  }, []);
  if (!isOn) {
    return null;
  }

  return <div>ScoreBoard</div>;
};

export default ScoreBoard;
