import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import { Message } from 'stompjs';
import Editor from '../components/game/Editor';
import { Problem, SubmissionResult, getRandomProblem } from '../api/Problem';
import { errorHandler } from '../api/Error';
import {
  MainContainer, FlexContainer, FlexInfoBar, Panel, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText, Text } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState } from '../util/Utility';
import Console from '../components/game/Console';
import Loading from '../components/core/Loading';
import { User } from '../api/User';
import Difficulty from '../api/Difficulty';
import { Game, getGame } from '../api/Game';
import { routes, subscribe } from '../api/Socket';
import { GameClock } from '../api/GameTimer';

type LocationState = {
  roomId: string,
  currentUser: User,
  difficulty: Difficulty,
}

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [game, setGame] = useState<Game | null>(null);
  const [currentClock, setCurrentClock] = useState<GameClock | null>(null);

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Variable to hold whether the user is subscribed to the primary Game socket.
  const [socketSubscribed, setSocketSubscribed] = useState(false);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  const updateClock = () => {
    if (game && game.gameTimer) {
      const newCurrentClock = (game.gameTimer.endTime.getTime() - Date.now()) / 1000;
      setInterval(() => setCurrentClock({
        minutes: newCurrentClock / 60,
        seconds: newCurrentClock % 60,
      }), 1000);
    }
  };

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string) => {
    const subscribeCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      setGame(updatedGame);
      setSocketSubscribed(true);

      // Check if end game.
      if (updatedGame.gameTimer.timeUp) {
        history.push('/game/results', {
          game,
        });
      }
    };

    subscribe(routes(roomIdParam).subscribe, subscribeCallback).catch((err) => {
      setError(err.message);
    });
  }, []);

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser', 'difficulty')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get a random problem.
      const request = { difficulty: location.state.difficulty };
      getRandomProblem(request).then((res) => {
        setFullPageLoading(false);
        setProblem(res);
      }).catch((err) => {
        setFullPageLoading(false);
        setError(err.message);
      });

      // Get game object with room details
      getGame(location.state.roomId)
        .then((res) => {
          setGame(res);
          updateClock();
          console.log(res);
        })
        .catch((err) => setError(err));
    } else {
      history.replace('/game/join', {
        error: errorHandler('No valid room details were provided, so you could not view the game page.'),
      });
    }
  }, [location, history]);

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
  };

  // Callback when user runs code against custom test case
  const runSolution = (input: string) => {
    const tempSubmission = { status: 'SUCCESS', output: input };
    setSubmission(tempSubmission);
  };

  // Redirect user to game page if room is active.
  useEffect(() => {
    if (!socketSubscribed && roomId) {
      subscribePrimary(roomId);
    }
  }, [socketSubscribed, roomId]);

  // If the page is loading, return a centered Loading object.
  if (fullPageLoading) {
    return (
      <MainContainer>
        <Loading />
      </MainContainer>
    );
  }

  return (
    <FlexContainer>
      <FlexInfoBar>
        Room:
        {' '}
        {roomId || 'An unknown room'}
        {` (${game?.roomDto?.users?.length} players)`}
      </FlexInfoBar>
      <FlexInfoBar>
        You are
        {' '}
        {currentUser != null ? currentUser.nickname : 'An unknown user'}
      </FlexInfoBar>
      <FlexInfoBar>
        Time:
        {(currentClock) ? currentClock.minutes : '00'}
        :
        {(currentClock) ? currentClock.seconds : '00'}
      </FlexInfoBar>

      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
        >
          {/* Problem title/description panel */}
          <Panel>
            <ProblemHeaderText>{problem?.name}</ProblemHeaderText>
            <Text>{problem?.description}</Text>
            {error ? <ErrorMessage message={error} /> : null}
          </Panel>

          {/* Code editor and console panels */}
          <SplitterLayout
            percentage
            vertical
            primaryMinSize={20}
            secondaryMinSize={1}
          >
            <Panel>
              <Editor />
            </Panel>

            <Panel>
              <Console
                testCases={problem?.testCases!}
                submission={submission}
                onRun={runSolution}
              />
            </Panel>
          </SplitterLayout>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
