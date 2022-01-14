import styled from 'styled-components';

const BORDER_RADIUS = '0.3rem';
const Container = styled.form`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    box-sizing: border-box;
    text-align: center;
  }

  input {
    width: 10em;
  }

  input[type='text'] {
    font-size: 0.8em;
    margin: 0.5em ${BORDER_RADIUS};
    padding: 0.2em 0;
    border: none;
    border-bottom: 2px solid ${(props) => props.theme.background.main};
    outline: none;
    &:focus {
      border-bottom-color: ${(props) => props.theme.blue.main};
    }
  }

  input[type='submit'] {
    margin: 0 auto;
    padding: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    background: ${(props) => props.theme.blue.main};
    color: ${(props) => props.theme.white.main};
    border: none;
    border-radius: ${BORDER_RADIUS};
  }
`;
const INPUT_ID = 'score-submit-name';
const Form = () => {
  return (
    <Container>
      <label htmlFor={INPUT_ID}>Your Name:</label>
      {/* reason for 'size': https://www.geeksforgeeks.org/how-to-specify-the-width-of-an-input-element-in-html5/ */}
      <input
        id={INPUT_ID}
        type="text"
        size={1}
        spellCheck="false"
        autoFocus
        required
        // autoComplete="off" // [NOTE] automcomplete covers error message
      />
      <input type="submit" value="Submit" />
    </Container>
  );
};
export default Form;
