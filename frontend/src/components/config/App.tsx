import React from 'react';
import { Switch } from 'react-router-dom';
import MainLayout from '../layout/Main';
import LandingPage from '../../views/Landing';
import NotFound from '../../views/NotFound';
import { CustomRoute, CustomRedirect } from './Route';
import GamePage from '../../views/Game';
import GameLayout from '../layout/Game';
import JoinGamePage from '../../views/Join';
import CreateGamePage from '../../views/Create';
import GameResultsPage from '../../views/Results';
import LobbyPage from '../../views/Lobby';
import AllProblemsPage from '../../views/AllProblemsPage';
import ProblemPage from '../../views/ProblemPage';
import CreateProblemPage from '../../views/CreateProblemPage';
import CircleBackgroundLayout from '../layout/CircleBackground';
import ContactUsPage from '../../views/ContactUs';
import MinimalLayout from '../layout/MinimalLayout';

function App() {
  return (
    <Switch>
      <CustomRoute path="/" component={LandingPage} layout={CircleBackgroundLayout} exact />
      <CustomRoute path="/game" component={GamePage} layout={GameLayout} exact />
      <CustomRoute path="/game/join" component={JoinGamePage} layout={MainLayout} exact />
      <CustomRoute path="/game/create" component={CreateGamePage} layout={MainLayout} exact />
      <CustomRoute path="/game/lobby" component={LobbyPage} layout={MinimalLayout} exact />
      <CustomRoute path="/game/results" component={GameResultsPage} layout={MainLayout} exact />
      <CustomRoute path="/problems/all" component={AllProblemsPage} layout={MinimalLayout} exact />
      <CustomRoute path="/problem/create" component={CreateProblemPage} layout={MinimalLayout} exact />
      <CustomRoute path="/problem/:id" component={ProblemPage} layout={MinimalLayout} exact />
      <CustomRoute path="/contact-us" component={ContactUsPage} layout={MainLayout} exact />
      <CustomRedirect from="/play" to="/game/join" />
      <CustomRoute path="*" component={NotFound} layout={MainLayout} />
    </Switch>
  );
}

export default App;
