import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import MainLayout from '../../layout/Main';
import LandingPage from '../../../views/Landing';
import NotFound from '../../../views/NotFound';
import { CustomRoute } from '../Route';
import GamePage from '../../../views/Game';
import GameLayout from '../../layout/Game';
import CreateGamePage from '../../../views/Create';
import JoinGamePage from '../../../views/Join';
import GameResultsPage from '../../../views/Results';

type MyProps = {};

type MyState = {
  message: String,
};

class App extends Component<MyProps, MyState> {
  render() {
    return (
      <div>
        <Switch>
          <CustomRoute path="/" component={LandingPage} layout={MainLayout} exact />
          <CustomRoute path="/game" component={GamePage} layout={GameLayout} exact />
          <CustomRoute path="/game/create" component={CreateGamePage} layout={MainLayout} exact />
          <CustomRoute path="/game/join" component={JoinGamePage} layout={MainLayout} exact />
          <CustomRoute path="/game/results" component={GameResultsPage} layout={GameLayout} exact />
          <CustomRoute path="*" component={NotFound} layout={MainLayout} />
        </Switch>
      </div>
    );
  }
}

export default App;
