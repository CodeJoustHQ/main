import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import { Message } from 'stompjs';
import Editor from '../components/game/Editor';
import { SubmissionResult } from '../api/Problem';
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
import { GameNotification, NotificationType } from '../api/GameNotification';
import Difficulty from '../api/Difficulty';
import { Game, getGame } from '../api/Game';
import { routes, send, subscribe } from '../api/Socket';
import GameTimerContainer from '../components/game/GameTimerContainer';
import GameNotificationContainer from '../components/game/GameNotificationContainer';

type LocationState = {
  roomId: string,
  currentUser: User,
  difficulty: Difficulty,
}

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [game, setGame] = useState<Game | null>(null);

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // When variable null, show nothing; otherwise, show notification.
  const [gameNotification, setGameNotification] = useState<GameNotification | null>(null);

  // Time, in milliseconds, before notification disappears. (Currently 15s.)
  const gameNotificationTime: number = 15000;

  // Variable to hold whether the user is subscribed to the primary Game socket.
  const [socketSubscribed, setSocketSubscribed] = useState(false);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  // Display notification only if no notification currently exists.
  const displayNotification = useCallback((result: Message) => {
    if (gameNotification == null) {
      const notificationResult: GameNotification = JSON.parse(result.body);
      setGameNotification(notificationResult);

      // Remove notification automatically after 15 seconds.
      setTimeout(() => {
        setGameNotification(null);
      }, gameNotificationTime);
    }
  }, [gameNotification, gameNotificationTime]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string) => {
    const subscribeUserCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      setGame(updatedGame);
      setSocketSubscribed(true);

      // Check if end game.
      if (updatedGame.gameTimer.timeUp) {
        history.push('/game/results', {
          game: updatedGame,
        });
      }
    };

    // Subscribe to the main Game channel to receive Game updates.
    subscribe(routes(roomIdParam).subscribe_user, subscribeUserCallback).catch((err) => {
      setError(err.message);
    });

    // Subscribe for Game Notifications.
    subscribe(routes(roomIdParam).subscribe_notification, displayNotification).catch((err) => {
      setError(err.message);
    });
  }, [history, displayNotification]);

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser', 'difficulty')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get game object with problem and room details.
      getGame(location.state.roomId)
        .then((res) => {
          setFullPageLoading(false);
          setGame(res);
          console.log(res);
        })
        .catch((err) => {
          setFullPageLoading(false);
          setError(err);
        });
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

  // Send notification if submission result is correct and currentUser is set.
  const checkSendTestCorrectNotification = (submissionParam: SubmissionResult) => {
    if (submissionParam.status === 'SUCCESS' && currentUser) {
      const notificationBody: string = JSON.stringify({
        initiator: currentUser,
        time: new Date(),
        notificationType: NotificationType.TestCorrect,
        content: submissionParam.output,
      });
      send(routes(roomId).subscribe_notification, {}, notificationBody);
    }
  };

  // Callback when user runs code against custom test case
  const runSolution = (input: string) => {
    const tempSubmission: SubmissionResult = { status: 'SUCCESS', output: input };
    setSubmission(tempSubmission);
    checkSendTestCorrectNotification(tempSubmission);
  };

  // Redirect user to game page if room is active.
  useEffect(() => {
    if (!socketSubscribed && roomId) {
      subscribePrimary(roomId);
    }
  }, [socketSubscribed, roomId, subscribePrimary]);

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
      <GameNotificationContainer gameNotification={gameNotification} currentUser={currentUser} />
      <FlexInfoBar>
        Room:
        {' '}
        {roomId || 'An unknown room'}
        {` (${game?.room?.users?.length} players)`}
      </FlexInfoBar>
      <FlexInfoBar>
        You are
        {' '}
        {currentUser != null ? currentUser.nickname : 'An unknown user'}
      </FlexInfoBar>
      <FlexInfoBar>
        <GameTimerContainer gameTimer={game ? game.gameTimer : null} />
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
            <ProblemHeaderText>{game?.problems[0]?.name}</ProblemHeaderText>
            <Text>{game?.problems[0]?.description}</Text>
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
                testCases={game?.problems[0]?.testCases!}
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
