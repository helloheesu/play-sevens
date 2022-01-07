import styled from 'styled-components';

const Container = styled.div`
  background-color: pink;
  width: 100%;
  height: 100%;
`;

interface Props {
  row: number;
  col: number;
  value: number;
}
const Card = ({ row, col, value }: Props) => {
  return (
    <Container
      style={{
        gridRow: `${row + 1}/${row + 2}`,
        gridColumn: `${col + 1}/${col + 2}`,
      }}
    >
      {value}
    </Container>
  );
};

export default Card;
