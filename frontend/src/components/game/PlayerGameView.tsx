import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import SplitterLayout from 'react-splitter-layout';
import MarkdownEditor from 'rich-markdown-editor';
import { useBeforeunload } from 'react-beforeunload';
import copy from 'copy-to-clipboard';
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
import { ProblemHeaderText, BottomFooterText, NoMarginDefaultText } from '../core/Text';
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
  getScore,
  getSubmissionTime,
  getSubmissionCount,
} from '../../api/Game';
import LeaderboardCard from '../card/LeaderboardCard';
import { getDifficultyDisplayButton, InheritedTextButton, SpectatorBackIcon } from '../core/Button';
import Language from '../../api/Language';
import { CopyIndicator, BottomCopyIndicatorContainer, InlineCopyIcon } from '../special/CopyIndicator';
import { useAppSelector, useBestSubmission } from '../../util/Hook';
import { routes, send, subscribe } from '../../api/Socket';
import { User } from '../../api/User';

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
}

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

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(gameError);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Java);
  const [currentCode, setCurrentCode] = useState('');
  const [defaultCodeList, setDefaultCodeList] = useState<DefaultCodeType[]>([]);

  // Variable to hold whether the user is subscribed to their own player socket.
  const [playerSocket, setPlayerSocket] = useState<Subscription | null>(null);

  // Variables to hold the player stats when spectating.
  const [playerSpectate, setPlayerSpectate] = useState<Player | null>(null);
  const bestSubmission = useBestSubmission(playerSpectate);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  // References necessary for the spectator subscription callback.
  const stateRef = useRef<StateRefType>();
  stateRef.current = {
    game,
    currentUser,
    currentCode,
    currentLanguage,
  };

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

  const sendViewUpdate = useCallback((gameParam: Game | null | undefined,
    currentUserParam: User | null | undefined,
    currentCodeParam: string | undefined,
    currentLanguageParam: string | undefined) => {
    if (gameParam && currentUserParam) {
      const spectatorViewBody: string = JSON.stringify({
        player: currentUserParam,
        problem: gameParam.problems[0],
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
    sendViewUpdate(game, currentUser, currentCode, currentLanguage);
  }, [game, currentUser, currentCode, currentLanguage, sendViewUpdate]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      if (JSON.parse(result.body).newSpectator) {
        sendViewUpdate(stateRef.current?.game, stateRef.current?.currentUser,
          stateRef.current?.currentCode, stateRef.current?.currentLanguage);
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

  // Map the game in Redux to the state variables used in this file
  useEffect(() => {
    if (game && currentUser && currentUser.userId) {
      // Get the new player object for spectating.
      game.players.forEach((player) => {
        if (currentUser.userId === player.user.userId) {
          setPlayerSpectate(player);
        }
      });

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
  }, [game, currentUser, defaultCodeList, setDefaultCodeFromProblems,
    subscribePlayer, playerSocket]);

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
      code: currentCode,
      language: currentLanguage,
    };

    runSolution(game!.room.roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'test' submission type to correctly display result.
        // eslint-disable-next-line no-param-reassign
        res.submissionType = SubmissionType.Test;
        setSubmission(res);
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

    submitSolution(game!.room.roomId, request)
      .then((res) => {
        setLoading(false);

        // Set the 'submit' submission type to correctly display result.
        // eslint-disable-next-line no-param-reassign
        res.submissionType = SubmissionType.Submit;
        setSubmission(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const displayPlayerLeaderboard = useCallback(() => game?.players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
    />
  )), [game, currentUser]);

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
              <b>{spectateGame?.player.nickname}</b>
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
                  {getSubmissionCount(playerSpectate)}
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
          {/* Problem title/description panel */}
          <OverflowPanel className="display-box-shadow">
            <ProblemHeaderText>
              {!spectateGame ? game?.problems[0]?.name : spectateGame?.problem.name}
            </ProblemHeaderText>
            {/* TODO: I don't know whether we have to verify that the problem exists. */}
            {
              !spectateGame ? (
                getDifficultyDisplayButton(game?.problems[0].difficulty!)
              ) : (
                getDifficultyDisplayButton(spectateGame?.problem.difficulty!)
              )
            }
            <StyledMarkdownEditor
              defaultValue={!spectateGame ? (
                game?.problems[0]?.description
              ) : (
                spectateGame?.problem.description
              )}
              value={spectateGame ? spectateGame?.problem.description : undefined}
              onChange={() => ''}
              readOnly
            />
            <BottomFooterText>
              {'Notice an issue? Contact us at '}
              <InheritedTextButton
                onClick={() => {
                  copy('support@codejoust.co');
                  setCopiedEmail(true);
                }}
              >
                support@codejoust.co
                <InlineCopyIcon>content_copy</InlineCopyIcon>
              </InheritedTextButton>
            </BottomFooterText>
          </OverflowPanel>

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
                    onCodeChange={setCurrentCode}
                    onLanguageChange={setCurrentLanguage}
                    codeMap={defaultCodeList[0]}
                    defaultLanguage={currentLanguage}
                    defaultCode={null}
                    liveCode={null}
                  />
                </NoPaddingPanel>
                <Panel>
                  <Console
                    testCases={game?.problems[0]?.testCases || []}
                    submission={submission}
                    onRun={runCode}
                    onSubmit={submitCode}
                  />
                </Panel>
              </SplitterLayout>
            ) : (
              <NoPaddingPanel className="display-box-shadow">
                <Editor
                  onLanguageChange={null}
                  onCodeChange={null}
                  codeMap={null}
                  defaultLanguage={spectateGame?.language as Language}
                  defaultCode={spectateGame?.code}
                  liveCode={spectateGame?.code}
                />
              </NoPaddingPanel>
            )
          }
        </SplitterLayout>
      </SplitterContainer>
      <BottomCopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </BottomCopyIndicatorContainer>
    </>
  );
}

export default PlayerGameView;
