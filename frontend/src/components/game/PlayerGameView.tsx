import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import Editor from './Editor';
import { DefaultCodeType, getDefaultCodeMap, Problem } from '../../api/Problem';
import {
  CenteredContainer,
  Panel,
  SplitterContainer,
  FlexBareContainer,
} from '../core/Container';
import ErrorMessage from '../core/Error';
import 'react-splitter-layout/lib/index.css';
import { NoMarginDefaultText } from '../core/Text';
import Console from './Console';
import Loading from '../core/Loading';
import {
  Game,
  runSolution,
  Submission,
  SubmissionType,
  submitSolution,
  SpectateGame,
  Player,
} from '../../api/Game';
import LeaderboardCard from '../card/LeaderboardCard';
import { SmallButton } from '../core/Button';
import { SpectatorBackIcon } from '../core/Icon';
import Language from '../../api/Language';
import { useAppSelector, useBestSubmission } from '../../util/Hook';
import { routes, send, subscribe } from '../../api/Socket';
import { User } from '../../api/User';
import { getScore, getSubmissionCount, getSubmissionTime } from '../../util/Utility';
import ProblemPanel from './ProblemPanel';

const NoPaddingPanel = styled(Panel)`
  padding: 0;
`;

const LeaderboardContent = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 75%;
  overflow-x: auto;
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

const GameHeaderContainer = styled(FlexBareContainer)`
  margin: 0 20px;
  height: 5rem;
`;

const GameHeaderContainerChild = styled.div`
  flex: 3;
  position: relative;
`;

const GameHeaderText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
`;

const GameHeaderStatsContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(0%, -50%);
  width: 100%;
`;

const GameHeaderStatsSubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0.5rem 1rem;
  text-align: left;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 -1px 8px rgb(0 0 0 / 8%);
`;

// The type used for the state reference.
type StateRefType = {
  game: Game | null,
  currentUser: User | null,
  currentCode: string,
  currentLanguage: string,
  currentIndex: number,
}

/**
 * The spectateGame and spectatorUnsubscribePlayer parameters are only used when
 * the game page is used for the spectator view. spectateGame is the live data,
 * primarily the player code, of the player being spectated.
 * spectatorUnsubscribePlayer unsubscribes the spectator from the player socket
 * and brings them back to the main spectator page.
 */
type PlayerGameViewProps = {
  gameError: string,
  spectateGame: SpectateGame | null,
  spectatorUnsubscribePlayer: (() => void) | null,
};

function PlayerGameView(props: PlayerGameViewProps) {
  const {
    gameError, spectateGame, spectatorUnsubscribePlayer,
  } = props;

  const { currentUser, game } = useAppSelector((state) => state);

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [languageList, setLanguageList] = useState<Language[]>([Language.Java]);
  const [codeList, setCodeList] = useState<string[]>(['']);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(gameError);

  const [defaultCodeList, setDefaultCodeList] = useState<DefaultCodeType[]>([]);

  // Variable to hold whether the user is subscribed to their own player socket.
  const [playerSocket, setPlayerSocket] = useState<Subscription | null>(null);

  // Variables to hold the player stats when spectating.
  const [spectatedPlayer, setSpectatedPlayer] = useState<Player | null>(null);
  const bestSubmission = useBestSubmission(spectatedPlayer);

  useEffect(() => setProblems(game?.problems || []), [game]);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  const getCurrentLanguage = useCallback(() => languageList[currentProblemIndex],
    [languageList, currentProblemIndex]);

  const setOneCurrentLanguage = (newLanguage: Language) => {
    setLanguageList(languageList.map((current, index) => {
      if (index === currentProblemIndex) {
        return newLanguage;
      }
      return current;
    }));
  };

  const setOneCurrentCode = (newCode: string) => {
    setCodeList(codeList.map((current, index) => {
      if (index === currentProblemIndex) {
        return newCode;
      }
      return current;
    }));
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

  // References necessary for the spectator subscription callback.
  const stateRef = useRef<StateRefType>();
  stateRef.current = {
    game,
    currentUser,
    currentCode: codeList[currentProblemIndex],
    currentLanguage: languageList[currentProblemIndex],
    currentIndex: currentProblemIndex,
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

      // Save the default code in these temporary lists
      for (let i = 0; i < result.length; i += 1) {
        newCodeList.push(result[i][Language.Java]);
        newLanguageList.push(Language.Java);
      }

      // If previous code and language specified, override the defaults
      for (let i = 0; i < result.length; i += 1) {
        const temp = getSubmission(i, playerSubmissions);

        if (temp) {
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

  const sendViewUpdate = useCallback((gameParam: Game | null | undefined,
    currentUserParam: User | null | undefined,
    currentCodeParam: string | undefined,
    currentLanguageParam: string | undefined,
    currentIndexParam: number | undefined) => {
    if (gameParam && currentUserParam) {
      const spectatorViewBody: string = JSON.stringify({
        user: currentUserParam,
        problem: gameParam.problems[currentIndexParam || 0], // must satisfy problems.length > 0
        code: currentCodeParam,
        language: currentLanguageParam,
      });
      send(
        routes(gameParam.room.roomId, currentUserParam.userId).subscribe_player,
        {},
        spectatorViewBody,
      );
    }
  }, []);

  // Send updates via socket to any spectators.
  useEffect(() => {
    sendViewUpdate(game, currentUser, codeList[currentProblemIndex],
      languageList[currentProblemIndex], currentProblemIndex);
  }, [game, currentUser, codeList, languageList, currentProblemIndex, sendViewUpdate]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      if (JSON.parse(result.body).newSpectator) {
        sendViewUpdate(stateRef.current?.game, stateRef.current?.currentUser,
          stateRef.current?.currentCode, stateRef.current?.currentLanguage,
          stateRef.current?.currentIndex);
      }
    };

    setLoading(true);
    subscribe(routes(roomIdParam, userIdParam).subscribe_player, subscribePlayerCallback)
      .then((subscription) => {
        setPlayerSocket(subscription);
        setError('');
      }).catch((err) => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [sendViewUpdate]);

  const getSpectatedPlayer = useCallback((gameParam: Game) => {
    // Get the new player object for spectating.
    gameParam.players.forEach((player) => {
      if (player.user.userId === spectateGame?.user.userId) {
        setSpectatedPlayer(player);
      }
    });
  }, [spectateGame, setSpectatedPlayer]);

  // Map the game in Redux to the state variables used in this file
  useEffect(() => {
    if (game && currentUser && currentUser.userId) {
      getSpectatedPlayer(game);

      // Subscribe the player to their own socket.
      if (!playerSocket) {
        subscribePlayer(game.room.roomId, currentUser.userId);
      }

      /**
       * If default code list is empty and current user (non-spectator) is
       * loaded, fetch the code from the backend
       */
      if (!defaultCodeList.length && !currentUser.spectator) {
        let matchFound = false;

        // If this user refreshed and has already submitted code, load and save their latest code
        game.players.forEach((player) => {
          if (player.user.userId === currentUser?.userId && player.submissions) {
            setDefaultCodeFromProblems(game.problems, player.submissions);
            matchFound = true;
          }
        });

        // If no previous code, proceed as normal with the default Java language
        if (!matchFound) {
          setDefaultCodeFromProblems(game.problems, []);
        }
      }
    }
  }, [game, currentUser, defaultCodeList, setDefaultCodeFromProblems,
    subscribePlayer, playerSocket, getSpectatedPlayer]);

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
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

    runSolution(game!.room.roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'test' submission type to correctly display result.
        // eslint-disable-next-line no-param-reassign
        res.submissionType = SubmissionType.Test;
        setCurrentSubmission(res);
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

    submitSolution(game!.room.roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'submit' submission type to correctly display result.
        // eslint-disable-next-line no-param-reassign
        res.submissionType = SubmissionType.Submit;
        setSubmissions(submissions.concat([res]));
        setCurrentSubmission(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const nextProblem = () => {
    const next = currentProblemIndex + 1;

    if (problems && next < problems.length) {
      setCurrentProblemIndex(next);
      setCurrentSubmission(getSubmission(next, submissions));
    }
  };

  const previousProblem = () => {
    const prev = currentProblemIndex - 1;

    if (prev >= 0) {
      setCurrentProblemIndex(prev);
      setCurrentSubmission(getSubmission(prev, submissions));
    }
  };

  const displayPlayerLeaderboard = useCallback(() => game?.players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
      numProblems={problems.length}
    />
  )), [game, currentUser, problems.length]);

  return (
    <>
      {!spectatorUnsubscribePlayer && !spectateGame ? (
        <LeaderboardContent>
          {displayPlayerLeaderboard()}
        </LeaderboardContent>
      ) : (
        <GameHeaderContainer>
          <GameHeaderContainerChild>
            <SpectatorBackIcon
              onClick={spectatorUnsubscribePlayer || (() => {})}
            >
              arrow_back
            </SpectatorBackIcon>
          </GameHeaderContainerChild>
          <GameHeaderContainerChild>
            <GameHeaderText>
              Spectating:
              {' '}
              <b>{spectateGame?.user.nickname}</b>
            </GameHeaderText>
          </GameHeaderContainerChild>
          <GameHeaderContainerChild>
            <GameHeaderStatsContainer>
              <GameHeaderStatsSubContainer>
                <NoMarginDefaultText>
                  <b>Score:</b>
                  {' '}
                  {getScore(bestSubmission)}
                </NoMarginDefaultText>
                <NoMarginDefaultText>
                  <b>Time:</b>
                  {' '}
                  {getSubmissionTime(bestSubmission, game?.gameTimer.startTime || null)}
                </NoMarginDefaultText>
                <NoMarginDefaultText>
                  <b>Submissions:</b>
                  {' '}
                  {getSubmissionCount(spectatedPlayer)}
                </NoMarginDefaultText>
              </GameHeaderStatsSubContainer>
            </GameHeaderStatsContainer>
          </GameHeaderContainerChild>
        </GameHeaderContainer>
      )}

      {loading ? <CenteredContainer><Loading /></CenteredContainer> : null}
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
          customClassName={!spectateGame ? 'game-splitter-container' : undefined}
        >
          <ProblemPanel
            problem={!spectateGame ? game?.problems[currentProblemIndex] : spectateGame.problem}
          />

          {/* Code editor and console panels */}
          {
            !spectateGame ? (
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
                    getCurrentLanguage={getCurrentLanguage}
                    defaultCodeMap={defaultCodeList}
                    currentProblem={currentProblemIndex}
                    defaultLanguage={Language.Java}
                    defaultCode={null}
                    liveCode={null}
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
            ) : (
              <NoPaddingPanel>
                <Editor
                  onLanguageChange={null}
                  onCodeChange={null}
                  defaultLanguage={spectateGame?.language as Language}
                  getCurrentLanguage={() => spectateGame?.language as Language}
                  defaultCodeMap={null}
                  currentProblem={currentProblemIndex}
                  defaultCode={spectateGame?.code}
                  liveCode={spectateGame?.code}
                />
              </NoPaddingPanel>
            )
          }
        </SplitterLayout>
      </SplitterContainer>

      <SmallButton onClick={previousProblem}>Previous</SmallButton>
      <SmallButton onClick={nextProblem}>Next</SmallButton>
    </>
  );
}

export default PlayerGameView;
