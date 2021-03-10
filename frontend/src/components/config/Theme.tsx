import React from 'react';
import { ThemeProvider } from 'styled-components';
import '@fontsource/titillium-web';
import '@fontsource/titillium-web/700.css';

export const ThemeConfig: any = {
  colors: {
    text: '#555',
    darkText: '#333',
    background: '#f8f8f8',
    border: '#ccc',
    lightBlue: '#AED2EA',
    blue: '#3E93CD',
    darkBlue: '#2E7DB2',
    red: 'red',
    gray: 'gray',
    lightGray: 'lightgray',
    white: 'white',
    greenCircle: 'linear-gradient(207.68deg, #14D633 10.68%, #DAFFB5 91.96%)',
    redCircle: 'linear-gradient(207.68deg, #DD145D 10.68%, #FFB7B7 91.96%)',
    blueCircle: 'linear-gradient(207.68deg, #133ED7 10.68%, #B7D4FF 91.96%)',
    pinkCircle: 'linear-gradient(207.68deg, #F25AFF 10.68%, #F5DAFF 91.96%)',
    yellowCircle: 'linear-gradient(207.68deg, #FFC700 10.68%, #FFFDC1 91.96%)',
    purpleCircle: 'linear-gradient(207.68deg, #9845EC 21.37%, #D9B4FF 102.65%)',
  },
  font: 'Titillium Web',
  fontSize: {
    xSmall: '0.4rem',
    small: '0.6rem',
    mediumSmall: '0.8rem',
    xMediumSmall: '0.9rem',
    default: '1rem',
    mediumLarge: '1.2rem',
    xMediumLarge: '1.5rem',
    large: '1.8rem',
    xLarge: '2rem',
    xxLarge: '2.5rem',
    globalDefault: '16px',
    globalSmall: '14px',
  },
};

export type ThemeType = typeof ThemeConfig;

const Theme = ({ children }: any) => (
  <ThemeProvider theme={ThemeConfig}>{children}</ThemeProvider>
);

export default Theme;
