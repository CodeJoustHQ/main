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
import { TextButton, DangerButton } from '../components/core/Button';
import { connect, routes, subscribe } from '../api/Socket';
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

  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [host, setHost] = useState<User | null>(null);
  const [spectators, setSpectators] = useState<User[]>([]);
  const [gameTimer, setGameTimer] = useState<GameTimer | null>(null);
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
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  const setStateFromGame = (newGame: Game) => {
    setHost(newGame.room.host);
    setRoomId(newGame.room.roomId);
    setGameTimer(newGame.gameTimer);
    setAllSolved(newGame.allSolved);
    setTimeUp(newGame.gameTimer.timeUp);
    setGameEnded(newGame.gameEnded);
    setSpectators(newGame.room.spectators);
  };

  const dispatch = useAppDispatch();
  const { currentUser, game } = useAppSelector((state) => state);

  // Map the game in Redux to the state variables used in this file
  useEffect(() => {
    if (game) {
      setFullPageLoading(false);
      setStateFromGame(game);
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
  }, [game, currentUser, dispatch, location, history]);

  const endGameAction = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to end the game for all players?')) {
      return;
    }

    manuallyEndGame(roomId, { initiator: currentUser! })
      .catch((err) => setError(err.message));
  };

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
      {
        currentUser?.spectator ? (
          <SpectatorGameView />
        ) : (
          <PlayerGameView
            gameError={error}
          />
        )
      }
    </FlexContainer>
  );
}

export default GamePage;
