import React from 'react';
import { ThemeProvider } from 'styled-components';

export const ThemeConfig: any = {
  colors: {
    text: '#444',
    background: '#f0f4f8',
    blue: '#3E93CD',
    darkBlue: '#2E7DB2',
    gray: 'gray',
    white: 'white',
  },
  font: 'Roboto',
  fontSize: {
    xSmall: '0.4rem',
    small: '0.6rem',
    mediumSmall: '0.8rem',
    default: '1rem',
    mediumLarge: '1.2rem',
    large: '1.8rem',
    xLarge: '2.5rem',
    globalDefault: '16px',
    globalSmall: '14px',
  },
};

export type ThemeType = typeof ThemeConfig;

const Theme = ({ children }: any) => (
  <ThemeProvider theme={ThemeConfig}>{children}</ThemeProvider>
);

export default Theme;
