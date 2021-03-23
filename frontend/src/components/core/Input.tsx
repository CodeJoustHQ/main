import styled from 'styled-components';

type Dimensions = {
  width?: string,
  height?: string,
};

const Input = styled.input<Dimensions>`
  box-sizing: border-box;
  border-radius: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  display: block;
  margin: 1rem auto;
  outline: none;
  font-weight: 700;
`;

export const PureTextInputTitle = styled.input.attrs(() => ({
  type: 'text',
}))`
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font};
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
  width: ${({ width }) => width || '16rem'};
  height: ${({ height }) => height || '3rem'};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-family: ${({ theme }) => theme.font};
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;
`;

export const PrimaryInput = styled(Input).attrs(() => ({
  type: 'button',
}))`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  background: ${({ theme }) => theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '16rem'};
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
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gradients.gray};

    &:hover {
      cursor: default;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
    }
  }
`;

export const ConsoleTextArea = styled.textarea`
  font-family: Monaco, monospace;
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.colors.darkText};
  margin: 2px;
  padding: 8px;
  
  min-width: 50px;
  max-width: 90%;
  width: 50%;
  min-height: 22px;
  height: unset;
  max-height: 150px;
  white-space: pre;
  resize: both;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  border: 2px solid ${({ theme }) => theme.colors.blue};
  border-radius: 0.3rem;
  
  &:focus {
    outline: none;
  }
`;

export const FixedTextArea = styled.textarea`
  font-family: monospace;
  margin: 2px;
  width: 100%;
  min-height: 24px;
  max-height: 150px;
  resize: none;

  padding: 5px;
  border: 2px solid ${({ theme }) => theme.colors.darkBlue};
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
  padding: 0.25rem 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.blue};

  &:focus {
    border: 2px solid ${({ theme }) => theme.colors.darkBlue};
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
