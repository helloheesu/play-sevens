import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  box-sizing: border-box;
`;
const Container = styled.div`
  background-color: #eee;
  min-width: 300px;
  min-height: 450px;
  max-width: 900px;
  max-height: 1350px;
  height: 80%;
  width: 80%;
  position: relative;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  padding: 1em;
  gap: 1em;
  box-sizing: border-box;
  position: absolute;
`;
const Cell = styled.div`
  background-color: darkgray;
`;
const Card = styled.div`
  background-color: pink;
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 3/4;
`;

function App() {
  return (
    <Wrapper>
      <Container>
        <Grid>
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
          <Cell />
        </Grid>
        <Grid>
          <Card />
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default App;
