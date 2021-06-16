import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { Message, Subscription } from 'stompjs';
import { unwrapResult } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { errorHandler } from '../api/Error';
import {
  FlexCenter, FlexContainer, FlexInfoBar, FlexLeft,
  FlexRight, MainContainer,
} from '../components/core/Container';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState, leaveRoom } from '../util/Utility';
import Loading from '../components/core/Loading';
import { User } from '../api/User';
import { Difficulty } from '../api/Difficulty';
import { Game, manuallyEndGame } from '../api/Game';
import GameTimerContainer from '../components/game/GameTimerContainer';
import { GameTimer } from '../api/GameTimer';
import {
  TextButton, DifficultyDisplayButton, SmallButton, DangerButton,
} from '../components/core/Button';
import {
  connect, routes, subscribe,
} from '../api/Socket';
import { useAppDispatch, useAppSelector } from '../util/Hook';
import { fetchGame, setGame } from '../redux/Game';
import { setCurrentUser } from '../redux/User';
import PlayerGameView from '../components/game/PlayerGameView';
import SpectatorGameView from '../components/game/SpectatorGameView';
import { Text } from '../components/core/Text';

const SpectatorText = styled(Text)`
  margin: 0 0 0 20px;
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

  // todo: possibly delete
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [host, setHost] = useState<User | null>(null);
  const [spectators, setSpectators] = useState<User[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);

  // todo: move block to new file
  const [problems, setProblems] = useState<Problem[]>([]);
  const [languageList, setLanguageList] = useState<Language[]>([Language.Java]);
  const [codeList, setCodeList] = useState<string[]>(['']);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  const [timeUp, setTimeUp] = useState(false);
  const [allSolved, setAllSolved] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

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
  useBeforeunload(() => 'Leaving this page may cause you to lose your code, host status, and/or other data.');

  const setStateFromGame = (newGame: Game) => {
    setHost(newGame.room.host);
    setRoomId(newGame.room.roomId);
    setGameTimer(newGame.gameTimer);
    setAllSolved(newGame.allSolved);
    setTimeUp(newGame.gameTimer.timeUp);
    setGameEnded(newGame.gameEnded);
    setSpectators(newGame.room.spectators);
  };

  // todo: move
  const createCodeLanguageArray = () => {
    while (languageList.length < problems.length) {
      languageList.push(Language.Java);
    }

    while (codeList.length < problems.length) {
      codeList.push('');
    }
  };

  const dispatch = useAppDispatch();
  const { currentUser, game } = useAppSelector((state) => state);

  // todo: move to useEffect
  createCodeLanguageArray();

  // todo: all of this and setDefaultCode, migrate to file
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

  // Map the game in Redux to the state variables used in this file
  useEffect(() => {
    if (game) {
      setFullPageLoading(false);
      setStateFromGame(game);

      // todo: remaining part of block, migrate
      // If default code list is empty and current user is loaded, fetch the code from the backend
      if (!defaultCodeList.length && currentUser) {
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
  }, [game, setFullPageLoading]);

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
    connect(userId).then(() => {
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

      // Subscribe for Game Notifications (removed the display).
      if (!notificationSocket) {
        subscribe(routes(roomIdParam).subscribe_notification, () => {})
          .then((subscription) => {
            setNotificationSocket(subscription);
          }).catch((err) => {
            setError(err.message);
          });
      }
    });
  }, [dispatch, gameSocket, notificationSocket]);

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
    // todo: the block that was here (now deleted), copy that over
  }, [game, currentUser, dispatch, location, history]);

  // todo: copy over
  const nextProblem = () => {
    setCurrentProblemIndex((currentProblemIndex + 1) % problems?.length);
    setCurrentSubmission(getSubmission((currentProblemIndex + 1) % problems?.length, submissions));
  };

  const previousProblem = () => {
    let temp = currentProblemIndex - 1;

    if (temp < 0) {
      temp += problems?.length;
    }

    setCurrentProblemIndex(temp);
    setCurrentSubmission(getSubmission(temp, submissions));
  };

  const endGameAction = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to end the game for all players?')) {
      return;
    }

    manuallyEndGame(roomId, { initiator: currentUser! })
      .catch((err) => setError(err.message));
  };

  // todo: copy this method over
  const displayPlayerLeaderboard = useCallback(() => players.map((player, index) => (
    <LeaderboardCard
      player={player}
      isCurrentPlayer={player.user.userId === currentUser?.userId}
      place={index + 1}
      color={player.color}
      numProblems={problems.length}
    />
  )), [players, currentUser, problems.length]);

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
      <FlexInfoBar>
        <FlexLeft>
          Room:
          {' '}
          {roomId || 'N/A'}
          <SpectatorText>
            Spectators (
            {spectators.length}
            )
          </SpectatorText>
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
      { // todo: this entire block that was deleted, copy over
        currentUser?.spectator ? (
          <SpectatorGameView />
        ) : (
          <PlayerGameView
            gameError={error}
            spectateGame={null}
            spectatorUnsubscribePlayer={null}
          />
        )
      }
    </FlexContainer>
  );
}

export default GamePage;
