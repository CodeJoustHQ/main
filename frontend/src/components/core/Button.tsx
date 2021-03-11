import styled from 'styled-components';
import { ThemeType } from '../config/Theme';

export const DefaultButton = styled.button`
  border: none;
  border-radius: 0.25rem;
  margin: 1.2rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  font-family: ${({ theme }) => theme.font};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  
  &:hover {
    outline: none;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
  
  &:focus {
    outline: none;
  }
`;

export const PrimaryButton = styled(DefaultButton)<any>`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-weight: 400;
  background: ${({ theme }) => theme.colors.blueCircle};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '16vw'};
  height: ${({ height }) => height || '4vw'};
  min-width: 150px;
  min-height: 40px;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};

    &:hover {
      cursor: default;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
    }
  }
`;

export const TextButton = styled.button<ThemeType>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.default};
  font-family: ${({ theme }) => theme.font};
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

type DifficultyProps = {
  active: boolean,
  enabled: boolean,
}

export const DifficultyButton = styled(DefaultButton)<DifficultyProps>`  
  color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.font)};
  background-color: ${({ theme, active }) => (active ? theme.colors.blue : theme.colors.white)};
  padding: 8px 16px;
  
  &:hover {
    ${({ theme, enabled }) => enabled && `
      color: ${theme.colors.white};
      background-color: ${theme.colors.blue};
    `};
    
    cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  }
`;

type ProblemIOTypeButtonProps = {
  active: boolean,
}

export const ProblemIOTypeButton = styled(DefaultButton)<ProblemIOTypeButtonProps>`  
  color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.font)};
  background-color: ${({ theme, active }) => (active ? theme.colors.blue : theme.colors.white)};
  padding: 4px 8px;
  margin: 0.8rem;
  
  &:hover {
    ${({ theme }) => `
      color: ${theme.colors.white};
      background-color: ${theme.colors.blue};
    `};
    
    cursor: pointer;
  }
`;

export const SmallButton = styled(DefaultButton)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.blueCircle};
  font-size: ${({ theme }) => theme.fontSize.xMediumSmall};
  padding: 0;
  margin: 0.4rem;
  width: 5.8rem;
  height: 2.1rem;
  line-height: 2rem;
`;

export const GreenSmallButton = styled(SmallButton)`
  background: ${({ theme }) => theme.colors.greenCircle};
`;
