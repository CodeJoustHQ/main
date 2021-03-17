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

type PrimaryButtonSize = {
  width: string,
  height: string,
};

export const PrimaryButton = styled(DefaultButton)<PrimaryButtonSize>`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  background: ${({ theme }) => theme.colors.gradients.blue};
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

export const RedTextButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.red2};
`;

export const GrayTextButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.regrayd2};
`;

type DifficultyProps = {
  difficulty: Difficulty,
  active: boolean,
  enabled: boolean,
}

export const SmallDifficultyButton = styled(DefaultButton)<DifficultyProps>`
  font-size: ${({ theme }) => theme.fontSize.default};
  font-weight: 700;
  background: ${({ active, difficulty, theme }) => (active ? difficultyToColor[difficulty].background : theme.colors.white)};
  color: ${({ active, difficulty, theme }) => (active ? theme.colors.white : difficultyToColor[difficulty].color)};
  width: 6vw;
  height: 3vw;
  min-width: 80px;
  min-height: 20px;
  border-radius: 20px;
  margin: 0.5rem 1rem 0 0;

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

export const DifficultyButton = styled(DefaultButton)<DifficultyProps>`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-weight: 700;
  background: ${({ active, difficulty, theme }) => (active ? difficultyToColor[difficulty].background : theme.colors.white)};
  color: ${({ active, difficulty, theme }) => (active ? theme.colors.white : difficultyToColor[difficulty].color)};
  width: 8vw;
  height: 3vw;
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

export const GraySmallButton = styled(SmallButton)`
  background: ${({ theme }) => theme.colors.gradients.gray};
`;
