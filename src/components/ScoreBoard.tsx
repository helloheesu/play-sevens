import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getScores, ScoreInfo } from '../fbase';

const Title = styled.p`
  text-align: center;
`;
const List = styled.ul`
  text-align: center;
  font-size: 0.8em;
`;

interface Props {
  row: number;
  col: number;
  username?: string;
  score?: number;
}

type LoadingState = 'initial' | 'loading' | 'loaded'; // shoudl be more about errors
const ScoreBoard = ({ row, col, username, score }: Props) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('initial');
  const [scores, setScores] = useState<ScoreInfo[]>([]);
  useEffect(() => {
    setLoadingState('loading');
    getScores(row, col).then((scores) => {
      setScores(scores);
      setLoadingState('loaded');
    });
  }, [col, row]);
  useEffect(() => {
    if (loadingState !== 'loaded') {
      return;
    }
    if (!username || typeof score !== 'number') {
      return;
    }

    const index = scores.findIndex((info) => info.username === username);
    if (!scores[index]) {
      setScores((scores) => [...scores, { username, score }]);
    } else {
      const prevScore = scores[index].score;

      if (score > prevScore) {
        setScores((scores) => [
          ...scores.slice(0, index),
          { username, score },
          ...scores.slice(index + 1),
        ]);
      }
    }
  }, [loadingState, username, scores, score]);

  if (!username) {
    return null;
  }
  if (loadingState !== 'loaded') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title>Score Board</Title>
      <List>
        {scores.map(({ username, score }) => (
          <li key={username}>
            {username}: {score}
          </li>
        ))}
      </List>
    </div>
  );
};

export default ScoreBoard;
