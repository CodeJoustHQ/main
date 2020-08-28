import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import fetchHello from '../../../api/hello';
import MainLayout from '../../layout/Main';
import LandingPage from '../../../views/Landing';
import NotFound from '../../../views/NotFound';
import { CustomRoute } from '../Route';
import GamePage from '../../../views/Game';
import GameLayout from '../../layout/Game';
import CreateGamePage from '../../../views/Create';
import JoinGamePage from '../../../views/Join';
import GameResultsPage from '../../../views/Results';

const StyledApp = styled.div`
  text-align: center;
  
  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }
  
  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

type MyProps = {};

type MyState = {
  message: String,
};

class App extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.state = { message: 'Loading' };
  }

  componentDidMount() {
    this.hello();
    setInterval(this.hello, 250);
  }

  hello = () => {
    fetchHello()
      .then((res) => {
        this.setState({ message: res.message });
      });
  };

  render() {
    const { message } = this.state;

    return (
      <StyledApp className="App">
        <Switch>
          <CustomRoute path="/" component={LandingPage} layout={MainLayout} exact />
          <CustomRoute path="/game" component={GamePage} layout={GameLayout} exact />
          <CustomRoute path="/game/create" component={CreateGamePage} layout={MainLayout} exact />
          <CustomRoute path="/game/join" component={JoinGamePage} layout={MainLayout} exact />
          <CustomRoute path="/game/results" component={GameResultsPage} layout={GameLayout} exact />
          <CustomRoute path="*" component={NotFound} layout={MainLayout} />
        </Switch>
      </StyledApp>
    );
  }
}

export default App;
