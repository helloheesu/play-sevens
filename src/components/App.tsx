import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Modal from './Modal';
import reducer, { getInitialState } from '../reducer';
import defaultTheme from '../theme';
import ScoreNameForm from './ScoreNameForm';
import ScoreBoard from './ScoreBoard';
import { logAnalytics, ScoreInfo } from '../fbase';
import { SwipeCallback, useSwipeable } from 'react-swipeable';
import useWindowSize from '../hooks/useWindowSize';
import { calculateScore } from '../utils/value';
import ResponsiveCellGrid from './ResponsiveCellGrid';
import { Direction } from '../utils/gridToLine';
import Menu from './Menu';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const SWIPE_THROTTLE = 10;
  const onSwiped: SwipeCallback = ({ dir }) => {
    if (deltaX < SWIPE_THROTTLE && deltaY < SWIPE_THROTTLE) {
      setIsMoving(false);
      return;
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setIsMoving(false);
        onMove(dir.toLowerCase() as Direction);
      }, 30);
    }
  };
  const handlers = useSwipeable({
    onSwiping: onSwiping,
    onSwiped: onSwiped,
    trackMouse: true,
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
          <Menu newCardValue={state.newCardValues[0]} onReset={handleReset} />
          <GridContainer ref={gridContainerRef}>
            <ResponsiveCellGrid
              state={state}
              dispatch={dispatch}
              gridContainerRef={gridContainerRef}
              isMoving={isMoving}
              direction={direction}
              deltaX={deltaX}
              deltaY={deltaY}
              isAnimating={isAnimating}
            />
          </GridContainer>
        </ContentWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
