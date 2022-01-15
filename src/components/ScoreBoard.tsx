import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllScores, getScores, ScoreInfo } from '../fbase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  text-align: center;
  margin-bottom: 1rem;
`;
const List = styled.ul`
  text-align: center;
  font-size: 0.8em;
`;
const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
const Username = styled.span`
  color: ${(props) => props.theme.black.main};
`;
const Score = styled.span`
  color: ${(props) => props.theme.blue.main};
`;
const Size = styled.span`
  color: ${(props) => props.theme.background.darken};
  font-size: 0.8em;
`;
const First = styled.p`
  font-size: 0.6em;
  color: ${(props) => props.theme.red.darken};
  text-align: center;
  margin-top: 0.5em;
`;
const MoreButton = styled.button`
  color: ${(props) => props.theme.white.main};
  background-color: ${(props) => props.theme.background.darken};
  border: none;
  padding: 0.6em 1em;
  border-radius: 3em;
  margin-top: 1em;
`;
const LoadingSpinner = () => <FontAwesomeIcon icon={faSpinner} />;

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
  const [isFirstUser, setIsFirstUser] = useState(false);
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

    if (!scores.length) {
      setIsFirstUser(true);
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

  const [shouldShowAllSize, setShouldShowAllSize] = useState(false);
  const [allScores, setAllScores] = useState<ScoreInfo[]>([]);
  const handleClickMore = () => {
    setShouldShowAllSize(true);
    setLoadingState('loading');
    getAllScores().then((scores) => {
      setAllScores(scores);
      setLoadingState('loaded');
    });
  };

  if (!username) {
    return null;
  }
  if (loadingState !== 'loaded') {
    return <LoadingSpinner />;
  }

  if (shouldShowAllSize) {
    return (
      <Container>
        <Title>All Scores</Title>
        <List>
          {allScores.map(({ username, score, size }) => (
            <Item key={username}>
              <Username>{username}</Username>: <Score>{score}</Score>{' '}
              <Size>in {size}</Size>
            </Item>
          ))}
        </List>
      </Container>
    );
  } else {
    return (
      <Container>
        <Title>Score Board</Title>
        {isFirstUser && (
          <First>You're the first recorder of this size! 🎉</First>
        )}
        <List>
          {scores.map(({ username, score }) => (
            <Item key={username}>
              <Username>{username}</Username>: <Score>{score}</Score>
            </Item>
          ))}
        </List>
        <MoreButton onClick={handleClickMore}>show all scores</MoreButton>
      </Container>
    );
  }
};

export default ScoreBoard;
