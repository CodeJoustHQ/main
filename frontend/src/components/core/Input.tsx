import styled from 'styled-components';

const Input = styled.input`
  box-sizing: border-box;
  border-radius: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  display: block;
  margin: 1rem auto;
  outline: none;
  font-weight: 700;
`;

export const LargeCenterInputText = styled(Input).attrs(() => ({
  type: 'text',
}))`
  width: 18rem;
  height: 3.5rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-family: ${({ theme }) => theme.font};
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const PrimaryInput = styled(Input).attrs(() => ({
  type: 'button',
}))`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  background: ${({ theme }) => theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '12rem'};
  height: ${({ height }) => height || '3rem'};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  border: none !important;
  font-weight: 400;
  min-width: 150px;
  min-height: 40px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
`;

export const ConsoleTextArea = styled.textarea`
  font-family: Monaco, monospace;
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.colors.text};
  margin: 2px;
  min-width: 50px;
  max-width: 90%;
  width: 70%;
  min-height: 24px;
  max-height: 150px;

  padding: 5px;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  border-radius: 0.3rem;
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
  display: block;
  width: 15rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  padding: 1rem;
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
