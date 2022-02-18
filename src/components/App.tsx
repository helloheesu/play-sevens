import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Card from './Card';
import Modal from './Modal';
import reducer, { getInitialState } from '../reducer';
import defaultTheme from '../theme';
import ScoreNameForm from './ScoreNameForm';
import ScoreBoard from './ScoreBoard';
import { logAnalytics, ScoreInfo } from '../fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { SwipeCallback, useSwipeable } from 'react-swipeable';
import useWindowSize from '../hooks/useWindowSize';
import { calculateScore } from '../utils/value';
import ResponsiveCellGrid from './ResponsiveCellGrid';
import {
  DEFAULT_SCALE_UNIT,
  HEIGHT_RATIO,
  WIDTH_RATIO,
} from '../utils/sizeConsts';
import { Direction } from '../utils/gridToLine';

// [NOTE] 100vh doesn't work properly on mobile
interface WrapperProps {
  windowHeight: number;
}
const Wrapper = styled.div<WrapperProps>`
  width: 100vw;
  height: ${(props) => props.windowHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
`;

const UIContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 0.4rem;
`;
const UIButton = styled.button`
  border: none;
  border-radius: 0.3rem;
  padding: 0.5em 1em;
  background-color: ${(props) => props.theme.background.darken};
  color: ${(props) => props.theme.white.main};
  box-shadow: 0 0.1rem 0 0 ${(props) => props.theme.black.main};
`;
const NextValueDisplay = styled.div`
  transform: scale(0.7);
`;

const GridContainer = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
`;

function App() {
  const { height } = useWindowSize();

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [score, setScore] = useState<number | null>(null);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch({ type: 'restartGame' });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      logAnalytics('page unload');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const onMove = (direction: Direction) => {
    dispatch({ type: 'merge', direction: direction });
    logAnalytics(`move ${direction}`);
  };

  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<Direction>();
  const [deltaX, setDeltaX] = useState<number>(0);
  const [deltaY, setDeltaY] = useState<number>(0);
  const onSwiping: SwipeCallback = ({ dir, deltaX, deltaY, first }) => {
    if (first) {
      setIsMoving(true);
      setDirection(dir.toLowerCase() as Direction);
    }
    switch (direction) {
      case 'left':
        setDeltaX(deltaX >= 0 ? 0 : -deltaX);
        break;
      case 'right':
        setDeltaX(deltaX > 0 ? deltaX : 0);
        break;
      case 'up':
        setDeltaY(deltaY >= 0 ? 0 : -deltaY);
        break;
      case 'down':
        setDeltaY(deltaY > 0 ? deltaY : 0);
        break;
      default:
        break;
    }
  };
  const SWIPE_THROTTLE = 10;
  const onSwiped: SwipeCallback = ({ dir }) => {
    if (!isMoving || deltaX > SWIPE_THROTTLE || deltaY > SWIPE_THROTTLE) {
      onMove(dir.toLowerCase() as Direction);
    }
    setIsMoving(false);
  };
  const handlers = useSwipeable({
    onSwiping: onSwiping,
    onSwiped: onSwiped,
  });

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          onMove('left');
          break;
        case 'ArrowRight':
          onMove('right');
          break;
        case 'ArrowUp':
          onMove('up');
          break;
        case 'ArrowDown':
          onMove('down');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const calculateTotalScore = useCallback((): number => {
    const totalScore = state.cardSlots.reduce((score, card) => {
      if (!card) {
        return score;
      } else {
        return score + calculateScore(card.value);
      }
    }, 0);

    return totalScore;
  }, [state.cardSlots]);

  const [isModalOn, setIsModalOn] = useState(false);
  const [isNameFormOn, setIsNameFormOn] = useState(false);
  const [scoreBoardInfo, setScoreBoardInfo] = useState<ScoreInfo | null>();

  useEffect(() => {
    setScore(state.isGameEnded ? calculateTotalScore() : null);
    state.isGameEnded && logAnalytics('game ended', { score });

    setIsNameFormOn(state.isGameEnded);
    setIsModalOn(state.isGameEnded);
  }, [calculateTotalScore, score, state.isGameEnded]);
  const onSubmit = (username: string, score: number) => {
    setIsNameFormOn(false);
    setScoreBoardInfo({ username, score });
    logAnalytics('post_score', { username, score });
  };
  const handleClose = () => {
    setIsModalOn(false);
    setScoreBoardInfo(null);
    logAnalytics('close modal');
  };

  const handleReset = () => {
    logAnalytics('restart game');
    dispatch({ type: 'restartGame' });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Wrapper windowHeight={height}>
        {isModalOn && (
          <Modal onClose={handleClose}>
            {isNameFormOn && (
              <ScoreNameForm
                score={Number(score)}
                row={state.rowSize}
                col={state.colSize}
                onSubmit={onSubmit}
              />
            )}
            <ScoreBoard
              row={state.rowSize}
              col={state.colSize}
              {...scoreBoardInfo}
            />
          </Modal>
        )}

        <ContentWrapper {...handlers} className="touchaction">
          <UIContainer>
            <UIButton onClick={() => alert('메뉴는 아직 만드는 중이예요 :p')}>
              <FontAwesomeIcon icon={faList} />
            </UIButton>
            <NextValueDisplay>
              <Card
                value={state.newCardValues[0]}
                width={DEFAULT_SCALE_UNIT * WIDTH_RATIO}
                height={DEFAULT_SCALE_UNIT * HEIGHT_RATIO}
              />
            </NextValueDisplay>
            <UIButton onClick={handleReset}>
              <FontAwesomeIcon
                icon={faRedoAlt}
                style={{ transform: 'scaleX(-1)' }}
              />
            </UIButton>
          </UIContainer>
          <GridContainer ref={gridContainerRef}>
            <ResponsiveCellGrid
              state={state}
              dispatch={dispatch}
              gridContainerRef={gridContainerRef}
              isMoving={isMoving}
              direction={direction}
              deltaX={deltaX}
              deltaY={deltaY}
            />
          </GridContainer>
        </ContentWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
