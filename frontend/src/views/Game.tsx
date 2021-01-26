import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import Editor from '../components/game/Editor';
import { Problem } from '../api/Problem';
import { errorHandler } from '../api/Error';
import {
  MainContainer, CenteredContainer, FlexContainer, FlexInfoBar,
  Panel, SplitterContainer, FlexLeft, FlexCenter, FlexRight,
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
import {
  Game, getGame, Player, SubmissionResult, submitSolution,
} from '../api/Game';
import LeaderboardCard from '../components/card/LeaderboardCard';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import { TextButton } from '../components/core/Button';
import {
  disconnect, routes, send, subscribe,
} from '../api/Socket';
import GameNotificationContainer from '../components/game/GameNotificationContainer';

type LocationState = {
  roomId: string,
  currentUser: User,
  difficulty: Difficulty,
};

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('java');
  const [timeUp, setTimeUp] = useState(false);
  const [allSolved, setAllSolved] = useState(false);

  // When variable null, show nothing; otherwise, show notification.
  const [gameNotification, setGameNotification] = useState<GameNotification | null>(null);

  // Variable to hold whether the user is subscribed to the primary Game socket.
  const [gameSocket, setGameSocket] = useState<Subscription | null>(null);

  // Variable to hold whether the user is subscribed to the notification socket.
  const [notificationSocket, setNotificationSocket] = useState<Subscription | null>(null);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  const setStateFromGame = (newGame: Game) => {
    setGame(newGame);
    setPlayers(newGame.players);
    setGameTimer(newGame.gameTimer);
    setProblems(newGame.problems);
    setAllSolved(newGame.allSolved);
    setTimeUp(newGame.gameTimer.timeUp);
  };

  /**
   * Display the notification as a callback from the notification
   * subscription. Do not display anything if notification is already
   * present or initiator is the current user.
   */
  const displayNotification = useCallback((result: Message) => {
    const notificationResult: GameNotification = JSON.parse(result.body);
    if (currentUser?.userId !== notificationResult?.initiator?.userId) {
      setGameNotification(notificationResult);
    }
  }, [currentUser]);

  // Check if game is over or not (TODO: include check for all solved)
  useEffect(() => {
    if (gameTimer?.timeUp) {
      gameSocket?.unsubscribe();
      notificationSocket?.unsubscribe();

      history.replace('/game/results', {
        game,
        currentUser,
      });
    }
  }, [gameTimer, game, history, currentUser, gameSocket, notificationSocket]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string) => {
    const subscribeUserCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      setStateFromGame(updatedGame);
    };

    // Subscribe to the main Game channel to receive Game updates.
    if (!gameSocket) {
      subscribe(routes(roomIdParam).subscribe_game, subscribeUserCallback)
        .then((subscription) => {
          setGameSocket(subscription);
        }).catch((err) => {
          setError(err.message);
        });
    }

    // Subscribe for Game Notifications.
    if (!notificationSocket) {
      subscribe(routes(roomIdParam).subscribe_notification, displayNotification)
        .then((subscription) => {
          setNotificationSocket(subscription);
        }).catch((err) => {
          setError(err.message);
        });
    }
  }, [displayNotification, gameSocket, notificationSocket]);

  useEffect(() => {
    // Check if end game.
    if (timeUp || allSolved) {
      // TODO
      history.push('/game/results');
    }
  }, [timeUp, allSolved, history]);

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser', 'difficulty')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get game object with problem and room details.
      getGame(location.state.roomId)
        .then((res) => {
          setStateFromGame(res);
          setFullPageLoading(false);
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
    if (submissionParam.numCorrect === submissionParam.numTestCases && currentUser) {
      const notificationBody: string = JSON.stringify({
        initiator: currentUser,
        time: new Date(),
        notificationType: NotificationType.TestCorrect,
        content: 'success',
      });
      send(routes(roomId).subscribe_notification, {}, notificationBody);
    }
  };

  // Callback when user runs code against custom test case
  const runSolution = (input: string) => {
    const request = {
      initiator: currentUser!,
      code: input,
      language: currentLanguage,
    };

    submitSolution(roomId, request)
      .then((res) => {
        setSubmission(res);
        checkSendTestCorrectNotification(res);
      })
      .catch((err) => setError(err));
  };

  const exitGame = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Exit the game? You will not be able to rejoin.')) {
      disconnect()
        .then(() => history.replace('/'))
        .catch((err) => setError(err.message));
    }
  };

  const displayPlayerLeaderboard = () => players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
    />
  ));

  // Subscribe user to primary socket and to notifications.
  useEffect(() => {
    if (!gameSocket && roomId) {
      subscribePrimary(roomId);
    }
  }, [gameSocket, roomId, subscribePrimary]);

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
      <GameNotificationContainer
        onClickFunc={setGameNotification}
        gameNotification={gameNotification}
      />
      <FlexInfoBar>
        <FlexLeft>
          Room:
          {' '}
          {roomId || 'N/A'}
        </FlexLeft>
        <FlexCenter>
          <GameTimerContainer gameTimer={gameTimer || null} />
        </FlexCenter>
        <FlexRight>
          <TextButton onClick={exitGame}>Exit Game</TextButton>
        </FlexRight>
      </FlexInfoBar>

      <CenteredContainer>
        {displayPlayerLeaderboard()}
      </CenteredContainer>

      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
        >
          {/* Problem title/description panel */}
          <Panel>
            <ProblemHeaderText>{problems[0]?.name}</ProblemHeaderText>
            <Text>{problems[0]?.description}</Text>
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
              <Editor onLanguageChange={setCurrentLanguage} />
            </Panel>

            <Panel>
              <Console
                testCases={problems[0]?.testCases}
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
