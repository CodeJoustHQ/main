import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, Text } from '../components/core/Text';
import { Game, Player, playAgain } from '../api/Game';
import { checkLocationState } from '../util/Utility';
import { errorHandler } from '../api/Error';
import PlayerResultsCard from '../components/card/PlayerResultsCard';
import { PrimaryButton } from '../components/core/Button';
import { Room } from '../api/Room';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import { routes, subscribe } from '../api/Socket';

const Content = styled.div`
  width: 75%;
`;

type LocationState = {
  game: Game,
  currentPlayer: Player,
  room: Room,
};

function GameResultsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [players, setPlayers] = useState<Player[]>();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (checkLocationState(location, 'game', 'room', 'currentPlayer')) {
      setPlayers(location.state.game.players);
      setRoom(location.state.room);
      setCurrentPlayer(location.state.currentPlayer);

      const subscribeCallback = (result: Message) => {
        const updatedGame: Game = JSON.parse(result.body);
        if (updatedGame.playAgain) {
          history.replace(`/game/lobby?room=${updatedGame.room.roomId}`, {
            user: location.state.currentPlayer.user,
            roomId: updatedGame.room.roomId,
          });
        }
      };

      subscribe(routes(location.state.room.roomId).subscribe_game, subscribeCallback)
        .catch((err) => setError(err.message));
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [location, history]);

  const playAgainAction = () => {
    setError('');
    setLoading(true);

    playAgain(room!.roomId, { initiator: currentPlayer!.user })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <Content>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
      <LargeText>Winners</LargeText>
      {players?.map((player, index) => (
        <PlayerResultsCard
          player={player}
          place={index + 1}
          isCurrentPlayer={currentPlayer?.user.userId === player.user.userId}
          color={player.color}
        />
      ))}

      {currentPlayer?.user.userId === room?.host.userId
        ? <PrimaryButton onClick={playAgainAction}>Play Again?</PrimaryButton>
        : <Text>Waiting for the host to choose whether to play again</Text>}
    </Content>
  );
}

export default GameResultsPage;
