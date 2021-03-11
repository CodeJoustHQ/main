import { ThemeConfig } from '../components/config/Theme';

export enum Difficulty {
  Random = 'RANDOM',
  Easy = 'EASY',
  Medium = 'MEDIUM',
  Hard = 'HARD',
}

type DifficultyColorMap = {
  [difficulty in Difficulty]: {
    color: string,
    background: string,
  }
}

export const difficultyToColor: DifficultyColorMap = {
  RANDOM: {
    color: ThemeConfig.colors.gray,
    background: ThemeConfig.colors.gradients.gray,
  },
  EASY: {
    color: ThemeConfig.colors.green,
    background: ThemeConfig.colors.gradients.green,
  },
  MEDIUM: {
    color: ThemeConfig.colors.yellow,
    background: ThemeConfig.colors.gradients.yellow,
  },
  HARD: {
    color: ThemeConfig.colors.red2,
    background: ThemeConfig.colors.gradients.red,
  },
};
