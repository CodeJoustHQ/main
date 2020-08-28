import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import 'typeface-roboto';
import App from './components/config/App';
import * as serviceWorker from './serviceWorker';
import Theme from './components/config/Theme';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100vh;
    // @ts-ignore
    font-family: ${({ theme }) => theme.font};
    // @ts-ignore
    font-size: ${({ theme }) => theme.fontSize.global};
    // @ts-ignore
    color: ${({ theme }) => theme.colors.text};
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
