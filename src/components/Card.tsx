import styled from 'styled-components';
import { IsMoveable } from '../utils/merge';
import { ColorKey } from '../theme';
import { Direction } from '../utils/gridToLine';

const getColors = (
  value: number
): { colorName: ColorKey; fontColor: ColorKey } => {
  switch (value) {
    case 1:
      return { colorName: 'red', fontColor: 'white' };
    case 2:
      return { colorName: 'blue', fontColor: 'white' };
    default:
      return { colorName: 'white', fontColor: 'black' };
  }
};

interface ContainerProps {
  colorName: ColorKey;
  fontColor: ColorKey;
  width: number;
  height: number;
}
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  font-size: 1.6rem;
  font-weight: 600;

  position: relative;
  top: -0.1em;
  border-radius: 0.3rem;
  background-color: ${(props) => props.theme[props.colorName].main};
  box-shadow: 0 0.3rem 0 0 ${(props) => props.theme[props.colorName].darken};
  p {
    margin: 0;
  }
  .score {
    font-size: 0.5em;
    color: ${(props) => props.theme[props.fontColor].main};
    opacity: 0.5;
    position: absolute;
    top: 0;
    margin-top: 0.1em;
  }
  .value {
    color: ${(props) => props.theme[props.fontColor].main};
  }
`;
const Arrows = styled.div`
  font-size: 0.5em;

  height: 100%;
  width: 100%;
  display: grid;
  align-content: space-between;
  justify-content: space-between;
  position: absolute;
  grid-template-areas:
    '. up .'
    'left . right'
    '. down .';
  .left {
    grid-area: left;
  }
  .right {
    grid-area: right;
  }
  .up {
    grid-area: up;
  }
  .down {
    grid-area: down;
  }
`;

interface Props {
  value: number;
  score?: number;
  width: number;
  height: number;
  isMoveable?: IsMoveable;
  isMoving?: boolean;
  direction?: Direction;
  deltaX?: number;
  deltaY?: number;
  isAnimating?: boolean;
  gap?: number;
  style?: React.CSSProperties;
}
const Card = ({
  value,
  score,
  width,
  height,
  gap,
  isMoveable,
  isMoving,
  direction,
  deltaX,
  deltaY,
  isAnimating,
  style,
}: Props) => {
  const { left, right, up, down } = isMoveable || {};

  const { colorName, fontColor } = getColors(value);

  let movingStyle: React.CSSProperties = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  if (isMoveable && isMoveable[direction!]) {
    if (isAnimating) {
      movingStyle.zIndex = 2;
      switch (direction) {
        case 'left':
          movingStyle.left = `-${width + (gap ? gap - 5 : 0)}px`;
          break;
        case 'right':
          movingStyle.left = `${width + (gap ? gap - 5 : 0)}px`;
          break;
        case 'up':
          movingStyle.top = `-${height + (gap ? gap - 5 : 0)}px`;
          break;
        case 'down':
          movingStyle.top = `${height + (gap ? gap - 5 : 0)}px`;
          break;
        default:
          break;
      }
    } else if (isMoving) {
      movingStyle.zIndex = 2;
      switch (direction) {
        case 'left':
          movingStyle.left = `-${Math.min(
            deltaX!,
            width + (gap ? gap - 5 : 0)
          )}px`;
          break;
        case 'right':
          movingStyle.left = `${Math.min(
            deltaX!,
            width + (gap ? gap - 5 : 0)
          )}px`;
          break;
        case 'up':
          movingStyle.top = `-${Math.min(
            deltaY!,
            height + (gap ? gap - 5 : 0)
          )}px`;
          break;
        case 'down':
          movingStyle.top = `${Math.min(
            deltaY!,
            height + (gap ? gap - 5 : 0)
          )}px`;
          break;
        default:
          break;
      }
    }
  }

  return (
    <Container
      colorName={colorName}
      fontColor={fontColor}
      width={width}
      height={height}
      style={{ ...style, ...movingStyle }}
    >
      {typeof score === 'number' && score > 0 && (
        <p className="score">+{score}</p>
      )}
      <p className="value">{value}</p>
      {process.env.REACT_APP_DEBUG_MOVEABLE === 'true' && (
        <Arrows>
          <div className="left">{left && 'L'}</div>
          <div className="right">{right && 'R'}</div>
          <div className="up">{up && 'U'}</div>
          <div className="down">{down && 'D'}</div>
        </Arrows>
      )}
    </Container>
  );
};

export default Card;
