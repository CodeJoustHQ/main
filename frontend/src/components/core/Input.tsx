import styled from 'styled-components';

const Input = styled.input`
  box-sizing: border-box;
  border-radius: 0.25rem;
  border: 3px solid ${({ theme }) => theme.colors.blue};
  display: block;
  margin: 1rem auto;
  outline: none;
  font-weight: 700;
`;

export const PureTextInputTitle = styled.input.attrs(() => ({
  type: 'text',
}))`
  border: none;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  font-weight: 700;
  padding: 0;
  width: 100%;

  &:focus {
    border: none;
    outline: none;
  }
`;

export const LargeCenterInputText = styled(Input).attrs(() => ({
  type: 'text',
}))`
  width: 20rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const LargeInputButton = styled(Input).attrs(() => ({
  type: 'button',
}))`
  width: 20rem;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  padding: 1rem;
  color: white;
  background-color: ${({ theme }) => theme.colors.blue};
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightBlue};
    border: 3px solid ${({ theme }) => theme.colors.lightBlue};
    cursor: default;
  }
`;

export const ConsoleTextArea = styled.textarea`
  font-family: monospace;
  margin: 2px;
  min-width: 20%;
  max-width: 70%;
  min-height: 24px;
  max-height: 150px;

  padding: 5px;
  border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  border-radius: 0.25rem;
  
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
`;

export const FixedTextArea = styled.textarea`
  font-family: monospace;
  margin: 2px;
  width: 100%;
  min-height: 24px;
  max-height: 150px;
  resize: none;

  padding: 5px;
  border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  border-radius: 0.25rem;
  
  font-size: ${({ theme }) => theme.fontSize.default};
`;

export const NumberInput = styled(Input).attrs(() => ({
  type: 'number',
}))`
  display: inline-block;
  width: 7rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const TextInput = styled(Input).attrs(() => ({
  type: 'text',
}))`
  display: inline-block;
  margin: 0 0.5rem 0 0;
  width: 5rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  font-family: ${({ theme }) => theme.font};
  font-weight: 400;
  padding: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const CheckboxInput = styled(Input).attrs(() => ({
  type: 'checkbox',
}))`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  color: ${({ theme }) => theme.colors.text};
  margin: 5px;
`;
