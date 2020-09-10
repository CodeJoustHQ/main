import styled from 'styled-components';

const Input = styled.input`
  box-sizing: border-box;
  border-radius: 0.25rem;
  border: 3px solid ${({ theme }) => theme.colors.blue};
  display: block;
  margin: 1rem auto;
  outline: none;
  font-weight: 700;

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const LargeCenterInputText = styled(Input).attrs(() => ({
  type: 'text',
}))`
  width: 20rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  padding: 1rem;
  color: #444;
`;

export const LargeInputButton = styled(Input).attrs(() => ({
  type: 'button',
}))`
  width: 20rem;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  padding: 1rem;
  color: white;
  background-color: #3E93CD;
  font-weight: 700;
  cursor: pointer;
`;
