import React from 'react';
import { Switch } from 'react-router-dom';
import MainLayout from '../layout/Main';
import LandingPage from '../../views/Landing';
import NotFound from '../../views/NotFound';
import CustomRoute from './Route';
import GamePage from '../../views/Game';
import GameLayout from '../layout/Game';
import JoinGamePage from '../../views/Join';
import CreateGamePage from '../../views/Create';
import GameResultsPage from '../../views/Results';
import LobbyPage from '../../views/Lobby';
import AllProblemsPage from '../../views/AllProblemsPage';
import ProblemPage from '../../views/ProblemPage';
import CreateProblemPage from '../../views/CreateProblemPage';

function App() {
  return (
    <Switch>
      <CustomRoute path="/" component={LandingPage} layout={MainLayout} exact />
      <CustomRoute path="/game" component={GamePage} layout={GameLayout} exact />
      <CustomRoute path="/game/join" component={JoinGamePage} layout={MainLayout} exact />
      <CustomRoute path="/game/create" component={CreateGamePage} layout={MainLayout} exact />
      <CustomRoute path="/game/lobby" component={LobbyPage} layout={MainLayout} exact />
      <CustomRoute path="/game/results" component={GameResultsPage} layout={MainLayout} exact />
      <CustomRoute path="/problem/all" component={AllProblemsPage} layout={MainLayout} exact />
      <CustomRoute path="/problem/create" component={CreateProblemPage} layout={MainLayout} exact />
      <CustomRoute path="/problem/:id" component={ProblemPage} layout={MainLayout} exact />
      <CustomRoute path="*" component={NotFound} layout={MainLayout} />
    </Switch>
  );
}

export default App;
