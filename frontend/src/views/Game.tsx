import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import { Message } from 'stompjs';
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
import Difficulty from '../api/Difficulty';
import {
  Game, getGame, Player, SubmissionResult, submitSolution,
} from '../api/Game';
import { Room } from '../api/Room';
import LeaderboardCard from '../components/card/LeaderboardCard';
import { routes, subscribe } from '../api/Socket';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import { TextLink } from '../components/core/Link';

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

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('java');

  // Variable to hold whether the user is subscribed to the primary Game socket.
  const [socketSubscribed, setSocketSubscribed] = useState(false);

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  const setStateFromGame = useCallback((game: Game) => {
    setRoom(game.room);
    setPlayers(game.players);
    setGameTimer(game.gameTimer);
    setProblems(game.problems);

    game.players.forEach((player) => {
      if (player.user.userId === currentUser?.userId) {
        setCurrentPlayer(player);
      }
    });
  }, [currentUser, room]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePrimary = useCallback((roomIdParam: string) => {
    const subscribeCallback = (result: Message) => {
      const updatedGame: Game = JSON.parse(result.body);
      setStateFromGame(updatedGame);
      setSocketSubscribed(true);

      // Check if end game.
      if (updatedGame.gameTimer.timeUp) {
        history.push('/game/results', {
          game: updatedGame,
        });
      }
    };

    subscribe(routes(roomIdParam).subscribe, subscribeCallback).catch((err) => {
      setError(err.message);
    });
  }, [history, setStateFromGame]);

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
  }, [location, history, setStateFromGame]);

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
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
      })
      .catch((err) => setError(err));
  };

  const displayPlayerLeaderboard = () => {
    return players.map((player, index) => (
      <LeaderboardCard
        player={player}
        isCurrentPlayer={player.user.userId === currentUser?.userId}
        place={index + 1}
        color="blue" // TODO: merge with Chris's color PR
      />
    ));
  };

  // Subscribe user to primary socket and to notifications.
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
          <TextLink to="/">Exit Game</TextLink>
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
                testCases={problems[0]?.testCases!}
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
