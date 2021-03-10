import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import MarkdownEditor from 'rich-markdown-editor';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import Editor from '../components/game/Editor';
import { DefaultCodeType, getDefaultCodeMap, Problem } from '../api/Problem';
import { errorHandler } from '../api/Error';
import {
  MainContainer, CenteredContainer, FlexContainer, FlexInfoBar,
  Panel, SplitterContainer, FlexLeft, FlexCenter, FlexRight,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState } from '../util/Utility';
import Console from '../components/game/Console';
import Loading from '../components/core/Loading';
import { User } from '../api/User';
import { GameNotification, NotificationType } from '../api/GameNotification';
import Difficulty from '../api/Difficulty';
import {
  Game, getGame, Player, Submission, submitSolution, runSolution, SubmissionType,
} from '../api/Game';
import LeaderboardCard from '../components/card/LeaderboardCard';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import { TextButton } from '../components/core/Button';
import {
  disconnect, routes, send, subscribe,
} from '../api/Socket';
import GameNotificationContainer from '../components/game/GameNotificationContainer';

const StyledMarkdownEditor = styled(MarkdownEditor)`
  padding: 0;
`;

const OverflowPanel = styled(Panel)`
  overflow-y: auto;
  height: 100%;
`;

const Temp = styled.div`
  //position: relative;

  //.layout-pane {
  //  box-shadow: none;
  //  //overflow: visible;
  //}
`;

type LocationState = {
  roomId: string,
  currentUser: User,
  difficulty: Difficulty,
};

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [submission, setSubmission] = useState<Submission | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [currentCode, setCurrentCode] = useState('');
  const [timeUp, setTimeUp] = useState(false);
  const [allSolved, setAllSolved] = useState(false);
  const [defaultCodeList, setDefaultCodeList] = useState<DefaultCodeType[]>([]);

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

  const setDefaultCodeFromProblems = useCallback((problemsParam: Problem[]) => {
    const promises: Promise<DefaultCodeType>[] = [];
    problemsParam.forEach((problem) => {
      if (problem && problem.problemId) {
        promises.push(getDefaultCodeMap(problem.problemId));
      }
    });

    // Get the result of promises and set the default code list.
    Promise.all(promises).then((result) => {
      setDefaultCodeList(result);
    }).catch((err) => {
      setError(err.message);
    });
  }, [setDefaultCodeList]);

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

  // Check if game is over or not and redirect to results page if so
  useEffect(() => {
    if (timeUp || allSolved) {
      // eslint-disable-next-line no-unused-expressions
      gameSocket?.unsubscribe();
      // eslint-disable-next-line no-unused-expressions
      notificationSocket?.unsubscribe();

      history.replace('/game/results', {
        game,
        currentUser,
      });
    }
  }, [timeUp, allSolved, game, history, currentUser, gameSocket, notificationSocket]);

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

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser', 'difficulty')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get game object with problem and room details.
      getGame(location.state.roomId)
        .then((res) => {
          setStateFromGame(res);
          setDefaultCodeFromProblems(res.problems);
          setFullPageLoading(false);
        })
        .catch((err) => {
          setFullPageLoading(false);
          setError(err.message);
        });
    } else {
      history.replace('/game/join', {
        error: errorHandler('No valid room details were provided, so you could not view the game page.'),
      });
    }
  }, [location, history, setDefaultCodeFromProblems]);

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
  };

  // Send notification if test submission is correct and currentUser is set.
  const checkSendTestCorrectNotification = (submissionParam: Submission) => {
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

  // Send notification if solution is correct and currentUser is set.
  const checkSendSolutionCorrectNotification = (submissionParam: Submission) => {
    if (currentUser) {
      const notificationBody: string = JSON.stringify({
        initiator: currentUser,
        time: new Date(),
        notificationType:
          (submissionParam.numCorrect === submissionParam.numTestCases)
            ? NotificationType.SubmitCorrect : NotificationType.SubmitIncorrect,
      });
      send(routes(roomId).subscribe_notification, {}, notificationBody);
    }
  };

  // Callback when user runs code against custom test case
  const runCode = (input: string) => {
    setLoading(true);
    setError('');
    const request = {
      initiator: currentUser!,
      input,
      code: currentCode,
      language: currentLanguage,
    };

    runSolution(roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'test' submission type to correctly display result.
        res.submissionType = SubmissionType.Test;
        setSubmission(res);
        checkSendTestCorrectNotification(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  // Callback when user runs code against custom test case
  const submitCode = () => {
    setLoading(true);
    setError('');
    const request = {
      initiator: currentUser!,
      code: currentCode,
      language: currentLanguage,
    };

    submitSolution(roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'submit' submission type to correctly display result.
        res.submissionType = SubmissionType.Submit;
        setSubmission(res);
        checkSendSolutionCorrectNotification(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
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

      {loading ? <Loading /> : null}
      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
          customClassName="game-splitter-container"
        >
          {/* Problem title/description panel */}
          <OverflowPanel className="display-box-shadow">
            <ProblemHeaderText>{problems[0]?.name}</ProblemHeaderText>
            {error ? <ErrorMessage message={error} /> : null}
            <StyledMarkdownEditor
              defaultValue={problems[0]?.description}
              onChange={() => ''}
              readOnly
            />
          </OverflowPanel>

          {/* Code editor and console panels */}
          <SplitterLayout
            vertical
            percentage
            primaryMinSize={20}
            secondaryMinSize={0}
          >
            <Panel>
              <Editor
                onCodeChange={setCurrentCode}
                onLanguageChange={setCurrentLanguage}
                codeMap={defaultCodeList[0]}
              />
            </Panel>

            <Panel>
              <Console
                testCases={problems[0]?.testCases}
                submission={submission}
                onRun={runCode}
                onSubmit={submitCode}
              />
            </Panel>
          </SplitterLayout>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
