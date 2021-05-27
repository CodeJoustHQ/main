import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import MarkdownEditor from 'rich-markdown-editor';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import copy from 'copy-to-clipboard';
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
  Game, getGame, Player, runSolution,
  Submission, SubmissionType, submitSolution,
} from '../api/Game';
import LeaderboardCard from '../components/card/LeaderboardCard';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import { TextButton, DifficultyDisplayButton, SmallButton } from '../components/core/Button';
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [languageList, setLanguageList] = useState<Language[]>([Language.Java]);
  const [codeList, setCodeList] = useState<string[]>(['']);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
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

  const createCodeLanguageArray = () => {
    /*
    Here is the console log statement I added that was being executed several times.
    The languageList.length kept throwing a null pointer exception, despite being defined above.
    */
    console.log(languageList);

    while (languageList.length < problems.length) {
      languageList.push(Language.Java);
    }

    while (codeList.length < problems.length) {
      codeList.push('');
    }
  };

  createCodeLanguageArray();

  const setOneCurrentLanguage = (newLanguage: Language) => {
    languageList[currentProblemIndex] = newLanguage;
  };

  const setOneCurrentCode = (newCode: string) => {
    codeList[currentProblemIndex] = newCode;
  };

  // Returns the most recent submission made for problem of index curr.
  const getSubmission = (curr: number, playerSubmissions: Submission[]) => {
    for (let i = playerSubmissions.length - 1; i >= 0; i -= 1) {
      if (playerSubmissions[i].problemIndex === curr) {
        return playerSubmissions[i];
      }
    }

    return null;
  };

  const setDefaultCodeFromProblems = useCallback((problemsParam: Problem[],
    playerSubmissions: Submission[]) => {
    setSubmissions(playerSubmissions);
    const promises: Promise<DefaultCodeType>[] = [];
    problemsParam.forEach((problem) => {
      if (problem && problem.problemId) {
        promises.push(getDefaultCodeMap(problem.problemId));
      }
    });

    // Get the result of promises and set the default code list.
    Promise.all(promises).then((result) => {
      const newCodeList = [];
      const newLanguageList = [];
      const codeMap = result;

      for (let i = 0; i < result.length; i += 1) {
        newCodeList.push(result[i][Language.Java]);
        newLanguageList.push(Language.Java);
      }

      // If previous code and language specified, save those as defaults
      for (let i = 0; i < result.length; i += 1) {
        const temp = getSubmission(i, playerSubmissions);

        if (temp != null) {
          newCodeList[i] = temp.code;
          codeMap[i][temp.language as Language] = temp.code;
          newLanguageList[i] = temp.language as Language;
          setCurrentProblemIndex(i);
        }
      }

      // Set this user's current code
      setCodeList(newCodeList);
      setLanguageList(newLanguageList);
      setDefaultCodeList(codeMap);
    }).catch((err) => {
      setError(err.message);
    });
  }, [setDefaultCodeList, setCodeList, setLanguageList]);

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
        roomId,
        currentUser,
      });
    }
  }, [timeUp, allSolved, game, history, currentUser, gameSocket, notificationSocket, roomId]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string, userId: string) => {
    const subscribeUserCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      setStateFromGame(updatedGame);
    };

    // Connect to the socket if not already
    connect(roomIdParam, userId).then(() => {
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
    });
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
          setFullPageLoading(false);

          let matchFound = false;

          // If this user refreshed and has already submitted code, load and save their latest code
          res.players.forEach((player) => {
            if (player.user.userId === location.state.currentUser.userId) {
              setDefaultCodeFromProblems(res.problems, player.submissions);
              matchFound = true;
            }
          });

          // If no previous code, proceed as normal with the default Python language
          if (!matchFound) {
            setDefaultCodeFromProblems(res.problems, []);
          }
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
      code: codeList[currentProblemIndex],
      language: languageList[currentProblemIndex],
      problemIndex: currentProblemIndex,
    };

    runSolution(roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'test' submission type to correctly display result.
        res.submissionType = SubmissionType.Test;
        submissions.push(res);
        setCurrentSubmission(getSubmission(currentProblemIndex, submissions));
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
      code: codeList[currentProblemIndex],
      language: languageList[currentProblemIndex],
      problemIndex: currentProblemIndex,
    };

    submitSolution(roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'submit' submission type to correctly display result.
        res.submissionType = SubmissionType.Submit;
        submissions.push(res);
        setCurrentSubmission(getSubmission(currentProblemIndex, submissions));
        checkSendSolutionCorrectNotification(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const nextProblem = () => {
    setCurrentProblemIndex((currentProblemIndex + 1) % problems?.length);
    setCurrentSubmission(getSubmission(currentProblemIndex, submissions));
  };

  const previousProblem = () => {
    let temp = currentProblemIndex - 1;

    if (temp < 0) {
      temp += problems?.length;
    }

    setCurrentProblemIndex(temp);
    setCurrentSubmission(getSubmission(currentProblemIndex, submissions));
  };

  const displayPlayerLeaderboard = useCallback(() => players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
      numProblems={problems.length}
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
          <TextButton onClick={() => leaveRoom(history, roomId, currentUser)}>Exit Game</TextButton>
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
            <ProblemHeaderText>{problems[currentProblemIndex]?.name}</ProblemHeaderText>
            {problems[currentProblemIndex] ? (
              <DifficultyDisplayButton
                difficulty={problems[currentProblemIndex].difficulty!}
                enabled={false}
                active
              >
                {displayNameFromDifficulty(problems[currentProblemIndex].difficulty!)}
              </DifficultyDisplayButton>
            ) : null}
            <StyledMarkdownEditor
              defaultValue={problems[0]?.description}
              value={problems[currentProblemIndex]?.description}
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
                onCodeChange={setOneCurrentCode}
                onLanguageChange={setOneCurrentLanguage}
                getCurrentLanguage={() => languageList[currentProblemIndex]}
                defaultCodeMap={defaultCodeList}
                currentProblem={currentProblemIndex}
                defaultLanguage={Language.Java}
                defaultCode={null}
              />
            </NoPaddingPanel>

            <Panel>
              <Console
                testCases={problems[currentProblemIndex]?.testCases}
                submission={currentSubmission}
                onRun={runCode}
                onSubmit={submitCode}
              />
            </Panel>
          </SplitterLayout>
        </SplitterLayout>
      </SplitterContainer>

      <SmallButton onClick={previousProblem}>Previous</SmallButton>
      <SmallButton onClick={nextProblem}>Next</SmallButton>

      <BottomCopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </BottomCopyIndicatorContainer>
    </FlexContainer>
  );
}

export default GamePage;
