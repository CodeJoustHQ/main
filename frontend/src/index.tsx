import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle, DefaultTheme } from 'styled-components';
import 'typeface-roboto';
import App from './components/config/App';
import * as serviceWorker from './serviceWorker';
import Theme, { ThemeType } from './components/config/Theme';

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  html {
    height: 100vh;
    min-width: 640px;
    // @ts-ignore
    font-family: ${({ theme }) => theme.font};
    // @ts-ignore
    font-size: ${({ theme }) => theme.fontSize.globalDefault};
    // @ts-ignore
    color: ${({ theme }) => theme.colors.text};
    
    @media (max-width: 800px) {
      // @ts-ignore
      font-size: ${({ theme }) => theme.fontSize.globalSmall};
    }
  }
  
  body {
    margin: 0;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <GlobalStyle />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Theme>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
