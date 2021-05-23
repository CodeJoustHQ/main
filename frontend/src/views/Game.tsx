import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import MarkdownEditor from 'rich-markdown-editor';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import copy from 'copy-to-clipboard';
import { unwrapResult } from '@reduxjs/toolkit';
import Editor from '../components/game/Editor';
import { DefaultCodeType, getDefaultCodeMap, Problem } from '../api/Problem';
import { errorHandler } from '../api/Error';
import {
  CenteredContainer, FlexCenter, FlexContainer,
  FlexInfoBar, FlexLeft, FlexRight, MainContainer,
  Panel, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState, leaveRoom } from '../util/Utility';
import { ProblemHeaderText, BottomFooterText } from '../components/core/Text';
import Console from '../components/game/Console';
import Loading from '../components/core/Loading';
import { User } from '../api/User';
import { GameNotification, NotificationType } from '../api/GameNotification';
import { Difficulty, displayNameFromDifficulty } from '../api/Difficulty';
import {
  Game, Player, runSolution,
  Submission, SubmissionType, submitSolution, manuallyEndGame,
} from '../api/Game';
import LeaderboardCard from '../components/card/LeaderboardCard';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import { TextButton, DifficultyDisplayButton, DangerButton } from '../components/core/Button';
import {
  connect, routes, send, subscribe,
} from '../api/Socket';
import GameNotificationContainer from '../components/game/GameNotificationContainer';
import Language from '../api/Language';
import {
  CopyIndicator,
  BottomCopyIndicatorContainer,
  SmallInlineCopyIcon,
  SmallInlineCopyText,
} from '../components/special/CopyIndicator';
import { useAppDispatch, useAppSelector } from '../util/Hook';
import { fetchGame, setGame } from '../redux/Game';
import { setCurrentUser } from '../redux/User';

const StyledMarkdownEditor = styled(MarkdownEditor)`
  margin-top: 15px;
  padding: 0;
  
  p {
    font-family: ${({ theme }) => theme.font};
  }

  // The specific list of attributes to have dark text color.
  .ProseMirror > p, blockquote, h1, h2, h3, ul, ol, table {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OverflowPanel = styled(Panel)`
  overflow-y: auto;
  height: 100%;
  padding: 0 25px;
`;

const NoPaddingPanel = styled(Panel)`
  padding: 0;
`;

const LeaderboardContent = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 75%;
  overflow-x: scroll;
  white-space: nowrap;
    
  // Show shadows if there is scrollable content  
  background-image: 
    /* Shadow covers */ 
    ${({ theme: { colors: { background } } }) => `linear-gradient(to right, ${background}, ${background})`},
    ${({ theme: { colors: { background } } }) => `linear-gradient(to left, ${background}, ${background})`},
  
    /* Shadows */ 
    ${({ theme: { colors: { background } } }) => `linear-gradient(to right, rgba(0,0,0.8,.12), ${background})`},
    ${({ theme: { colors: { background } } }) => `linear-gradient(to left, rgba(0,0,0,.12), ${background})`};

  background-position: left center, right center, 0.15% center, 99.85% center;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.background};
  background-size: 20px 100%, 20px 100%, 10px 100%, 10px 100%;
  background-attachment: local, local, scroll, scroll;
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

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [host, setHost] = useState<User | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Java);
  const [currentCode, setCurrentCode] = useState('');
  const [timeUp, setTimeUp] = useState(false);
  const [allSolved, setAllSolved] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
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
    setHost(newGame.room.host);
    setRoomId(newGame.room.roomId);
    setPlayers(newGame.players);
    setGameTimer(newGame.gameTimer);
    setProblems(newGame.problems);
    setAllSolved(newGame.allSolved);
    setTimeUp(newGame.gameTimer.timeUp);
    setGameEnded(newGame.gameEnded);
  };

  const dispatch = useAppDispatch();
  const { currentUser, game } = useAppSelector((state) => state);

  const setDefaultCodeFromProblems = useCallback((problemsParam: Problem[],
    code: string, language: Language) => {
    const promises: Promise<DefaultCodeType>[] = [];
    problemsParam.forEach((problem) => {
      if (problem && problem.problemId) {
        promises.push(getDefaultCodeMap(problem.problemId));
      }
    });

    // Get the result of promises and set the default code list.
    Promise.all(promises).then((result) => {
      const codeMap = result[0];

      // If previous code and language specified, save those as defaults
      if (code) {
        codeMap[language] = code;
      }

      // Set this user's current code and language
      setCurrentCode(codeMap[language]);
      setCurrentLanguage(language);

      setDefaultCodeList(result);
    }).catch((err) => {
      setError(err.message);
    });
  }, [setDefaultCodeList, setCurrentCode, setCurrentLanguage]);

  // Map the game in Redux to the state variables used in this file
  useEffect(() => {
    if (game) {
      setFullPageLoading(false);
      setStateFromGame(game);

      // If default code list is empty and current user is loaded, fetch the code from the backend
      if (!defaultCodeList.length && currentUser) {
        let matchFound = false;

        // If this user refreshed and has already submitted code, load and save their latest code
        game.players.forEach((player) => {
          if (player.user.userId === currentUser?.userId && player.code) {
            setDefaultCodeFromProblems(game.problems, player.code, player.language as Language);
            matchFound = true;
          }
        });

        // If no previous code, proceed as normal with the default Java language
        if (!matchFound) {
          setDefaultCodeFromProblems(game.problems, '', Language.Java);
        }
      }
    }
  }, [game, currentUser, defaultCodeList, setDefaultCodeFromProblems, setFullPageLoading]);

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
    if (gameEnded || timeUp || allSolved) {
      // eslint-disable-next-line no-unused-expressions
      gameSocket?.unsubscribe();
      // eslint-disable-next-line no-unused-expressions
      notificationSocket?.unsubscribe();

      history.replace('/game/results', {
        roomId,
        currentUser,
      });
    }
  }, [gameEnded, timeUp, allSolved, game, history,
    currentUser, gameSocket, notificationSocket, roomId]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string, userId: string) => {
    const subscribeUserCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      dispatch(setGame(updatedGame));
    };

    // Connect to the socket if not already
    connect(roomIdParam, userId).then(() => {
      // Subscribe to the main Game channel to receive Game updates.
      if (!gameSocket) {
        subscribe(routes(roomIdParam).subscribe_game, subscribeUserCallback)
          .then((subscription) => {
            setGameSocket(subscription);
            dispatch(fetchGame(roomIdParam))
              .then(unwrapResult)
              .catch((err) => setError(err.message));
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
    });
  }, [dispatch, displayNotification, gameSocket, notificationSocket]);

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser')) {
      if (!game || game?.room.roomId !== location.state.roomId) {
        dispatch(fetchGame(location.state.roomId))
          .then(unwrapResult)
          .catch((err) => setError(err.message));
      }
      if (!currentUser) {
        dispatch(setCurrentUser(location.state.currentUser));
      }
    } else {
      history.replace('/game/join', {
        error: errorHandler('No valid room details were provided, so you could not view the game page.'),
      });
    }
  }, [game, currentUser, dispatch, location, history, setDefaultCodeFromProblems]);

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

  const endGameAction = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to end the game for all players?')) {
      return;
    }

    manuallyEndGame(roomId, { initiator: currentUser! })
      .catch((err) => setError(err.message));
  };

  const displayPlayerLeaderboard = useCallback(() => players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
    />
  )), [players, currentUser]);

  // Subscribe user to primary socket and to notifications.
  useEffect(() => {
    if (!gameSocket && roomId && currentUser?.userId) {
      subscribePrimary(roomId, currentUser!.userId);
    }
  }, [gameSocket, roomId, currentUser, subscribePrimary]);

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
          <TextButton onClick={() => leaveRoom(dispatch, history, roomId, currentUser)}>
            Exit Game
          </TextButton>
          {currentUser?.userId === host?.userId ? (
            <DangerButton onClick={endGameAction}>
              End Game
            </DangerButton>
          ) : null}
        </FlexRight>
      </FlexInfoBar>
      <LeaderboardContent>
        {displayPlayerLeaderboard()}
      </LeaderboardContent>

      {loading ? <CenteredContainer><Loading /></CenteredContainer> : null}
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
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
            {problems[0] ? (
              <DifficultyDisplayButton
                difficulty={problems[0].difficulty!}
                enabled={false}
                active
              >
                {displayNameFromDifficulty(problems[0].difficulty!)}
              </DifficultyDisplayButton>
            ) : null}
            <StyledMarkdownEditor
              defaultValue={problems[0]?.description}
              onChange={() => ''}
              readOnly
            />
            <BottomFooterText>
              {'Notice an issue? Contact us at '}
              <SmallInlineCopyText
                onClick={() => {
                  copy('support@codejoust.co');
                  setCopiedEmail(true);
                }}
              >
                support@codejoust.co
                <SmallInlineCopyIcon>content_copy</SmallInlineCopyIcon>
              </SmallInlineCopyText>
            </BottomFooterText>
          </OverflowPanel>

          {/* Code editor and console panels */}
          <SplitterLayout
            vertical
            percentage
            primaryMinSize={20}
            secondaryMinSize={0}
          >
            <NoPaddingPanel>
              <Editor
                onCodeChange={setCurrentCode}
                onLanguageChange={setCurrentLanguage}
                codeMap={defaultCodeList[0]}
                defaultLanguage={currentLanguage}
                defaultCode={null}
              />
            </NoPaddingPanel>

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
      <BottomCopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </BottomCopyIndicatorContainer>
    </FlexContainer>
  );
}

export default GamePage;
