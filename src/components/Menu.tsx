import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import {
  DEFAULT_SCALE_UNIT,
  HEIGHT_RATIO,
  WIDTH_RATIO,
} from '../utils/sizeConsts';

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

interface Props {
  newCardValue: number;
  onReset: () => void;
}
const Menu = ({ newCardValue, onReset }: Props) => {
  return (
    <UIContainer>
      <UIButton onClick={() => alert('메뉴는 아직 만드는 중이예요 :p')}>
        <FontAwesomeIcon icon={faList} />
      </UIButton>
      <NextValueDisplay>
        <Card
          value={newCardValue}
          width={DEFAULT_SCALE_UNIT * WIDTH_RATIO}
          height={DEFAULT_SCALE_UNIT * HEIGHT_RATIO}
        />
      </NextValueDisplay>
      <UIButton onClick={onReset}>
        <FontAwesomeIcon icon={faRedoAlt} style={{ transform: 'scaleX(-1)' }} />
      </UIButton>
    </UIContainer>
  );
};

export default Menu;
