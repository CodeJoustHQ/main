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

export const NumberInput = styled(Input).attrs(() => ({
  type: 'number',
}))`
  width: 50px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.medium};
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;
