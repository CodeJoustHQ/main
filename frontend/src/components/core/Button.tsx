import styled from 'styled-components';
import { Difficulty, difficultyToColor } from '../../api/Difficulty';
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
  background: ${({ theme }) => theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '10rem'};
  height: ${({ height }) => height || '2.75rem'};
  min-width: 150px;
  min-height: 40px;

  &:disabled {
    opacity: 0.5;
    background: ${({ theme }) => theme.colors.gradients.gray};

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

export const RedTextButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.red2};
`;

export const GrayTextButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.gray};
`;

type DifficultyProps = {
  difficulty: Difficulty,
  active: boolean,
  enabled: boolean,
}

export const SmallDifficultyButton = styled(DefaultButton)<DifficultyProps>`
  font-size: ${({ theme }) => theme.fontSize.default};
  background: ${({ active, difficulty, theme }) => (active ? difficultyToColor[difficulty].background : theme.colors.white)};
  color: ${({ active, difficulty, theme }) => (active ? theme.colors.white : difficultyToColor[difficulty].color)};
  width: 5rem;
  height: 2rem;
  border-radius: 20px;
  margin: 0.5rem 1rem 0 0;

  &:disabled {
    opacity: 0.5;

    &:hover {
      cursor: default;
      opacity: 0.5;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
    }
  }
  
  &:hover {
    ${({
    difficulty,
    theme,
    enabled,
  }) => enabled && `
      color: ${theme.colors.white};
      background: ${difficultyToColor[difficulty].background};
    `};
    
    cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  }
`;

export const DifficultyButton = styled(DefaultButton)<DifficultyProps>`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  background: ${({ active, difficulty, theme }) => (active ? difficultyToColor[difficulty].background : theme.colors.white)};
  color: ${({ active, difficulty, theme }) => (active ? theme.colors.white : difficultyToColor[difficulty].color)};
  width: 6rem;
  height: 2rem;
  min-width: 90px;
  min-height: 40px;
  border-radius: 20px;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};

    &:hover {
      cursor: default;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
    }
  }
  
  &:hover {
    ${({
    difficulty,
    theme,
    enabled,
  }) => enabled && `
      color: ${theme.colors.white};
      background: ${difficultyToColor[difficulty].background};
    `};
    
    cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  }
`;

export const SmallButton = styled(DefaultButton)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.gradients.blue};
  font-size: ${({ theme }) => theme.fontSize.medium};
  padding: 0;
  margin: 0.4rem;
  width: 6rem;
  height: 2.25rem;
  line-height: 2rem;
`;

export const GreenSmallButton = styled(SmallButton)`
  background: ${({ theme }) => theme.colors.gradients.green};
`;

export const GreenSmallButtonBlock = styled(SmallButton)`
  display: block;
  background: ${({ theme }) => theme.colors.gradients.green};
`;

export const InvertedSmallButton = styled(SmallButton)`
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`;

export const InlineRefreshIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  display: inline-block;
  margin: 0 0 0 10px;
  padding: 0.25rem;
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  color: ${({ theme }) => theme.colors.font};

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
`;
