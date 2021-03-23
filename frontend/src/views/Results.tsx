import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, Text } from '../components/core/Text';
import {
  getGame, Game, Player, playAgain,
} from '../api/Game';
import { checkLocationState } from '../util/Utility';
import { errorHandler } from '../api/Error';
import PlayerResultsCard from '../components/card/PlayerResultsCard';
import { PrimaryButton, SecondaryRedButton } from '../components/core/Button';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import {
  connect, disconnect, routes, subscribe,
} from '../api/Socket';
import { User } from '../api/User';
import { ThemeConfig } from '../components/config/Theme';
import Podium from '../components/special/Podium';
import { removeUser } from '../api/Room';

const Content = styled.div`
  padding: 0;
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type LocationState = {
  roomId: string,
  currentUser: User,
};

function GameResultsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [host, setHost] = useState<User | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser')) {
      setRoomId(location.state.roomId);
      setCurrentUser(location.state.currentUser);

      // Function that's called when playAgain is triggered
      const playAgainAction = (game: Game) => {
        disconnect()
          .then(() => {
            history.replace(`/game/lobby?room=${game.room.roomId}`, {
              user: location.state.currentUser,
              roomId: game.room.roomId,
            });
          });
      };

      const subscribeCallback = (result: Message) => {
        const updatedGame: Game = JSON.parse(result.body);

        setStartTime(updatedGame.gameTimer.startTime);
        // Update leaderboard with last second submissions
        setPlayers(updatedGame.players);
        // Set new host if the previous host refreshes or leaves
        setHost(updatedGame.room.host);

        // Disconnect users from socket and then redirect them to the lobby page
        if (updatedGame.playAgain) {
          playAgainAction(updatedGame);
        }
      };

      /**
       * Connect, subscribe, and then finally get the game details. Doing so in this order ensures
       * that any late submissions are properly received (either through the socket update or
       * through the get game request) and reflected on the leaderboard.
       */
      connect(location.state.roomId, location.state.currentUser.userId!).then(() => {
        subscribe(routes(location.state.roomId).subscribe_game, subscribeCallback)
          .then(() => {
            // Get latest game information
            getGame(location.state.roomId).then((res) => {
              setLoading(false);
              setPlayers(res.players);
              setHost(res.room.host);
              setStartTime(res.gameTimer.startTime);

              // Check if host elected to play again
              if (res.playAgain) {
                playAgainAction(res);
              }
            }).catch((err) => setError(err.message));
          })
          .catch((err) => setError(err.message));
      }).catch((err) => setError(err.message));
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [location, history]);

  const callPlayAgain = () => {
    setError('');
    setLoading(true);

    playAgain(roomId, { initiator: currentUser! })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const leaveRoom = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to leave the room?')) {
      if (currentUser && currentUser.userId) {
        setLoading(true);
        setError('');
        removeUser(roomId, {
          initiator: currentUser,
          userToDelete: currentUser,
        });
        disconnect();
      }

      history.replace('/game/join', {
        error: errorHandler('You left the game.'),
      });
    }
  };

  return (
    <Content>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
      <LargeText>Winners</LargeText>

      <PodiumContainer>
        <Podium
          place={2}
          player={players[1]}
          gameStartTime={startTime}
          loading={loading}
        />
        <Podium
          place={1}
          player={players[0]}
          gameStartTime={startTime}
          loading={loading}
        />
        <Podium
          place={3}
          player={players[2]}
          gameStartTime={startTime}
          loading={loading}
        />
      </PodiumContainer>

      <div>
        <PrimaryButton
          color={ThemeConfig.colors.gradients.blue}
          onClick={callPlayAgain}
          disabled={!currentUser || currentUser?.userId !== host?.userId}
        >
          Play Again
        </PrimaryButton>
        <SecondaryRedButton
          onClick={leaveRoom}
        >
          Leave Room
        </SecondaryRedButton>
      </div>

      {players?.map((player, index) => (
        <PlayerResultsCard
          player={player}
          place={index + 1}
          isCurrentPlayer={currentUser?.userId === player.user.userId}
          color={player.color}
        />
      ))}

      {currentUser && currentUser?.userId === host?.userId
        ? (
          <PrimaryButton
            color={ThemeConfig.colors.gradients.blue}
            onClick={callPlayAgain}
            title="Only the host can perform this action."
          >
            Play Again
          </PrimaryButton>
        )
        : <Text>{!loading && 'Waiting for the host to choose whether to play again...'}</Text>}
    </Content>
  );
}

export default GameResultsPage;
