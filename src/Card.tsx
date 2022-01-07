import styled from 'styled-components';

const Container = styled.div`
  background-color: pink;
  width: 100%;
  height: 100%;
`;

type Props = {
  row: number;
  col: number;
};
const Card = ({ row, col }: Props) => {
  return (
    <Container
      style={{
        gridRow: `${row + 1}/${row + 2}`,
        gridColumn: `${col + 1}/${col + 2}`,
      }}
    />
  );
};

export default Card;
