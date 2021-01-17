import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import { LargeText } from '../components/core/Text';
import { Game, Player } from '../api/Game';
import { checkLocationState } from '../util/Utility';
import { errorHandler } from '../api/Error';
import PlayerResultsCard from '../components/card/PlayerResultsCard';
import { PrimaryButton } from '../components/core/Button';
import { Room } from '../api/Room';

const Content = styled.div`
  width: 75%;
`;

type LocationState = {
  game: Game,
  currentPlayer: Player,
};

function GameResultsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [players, setPlayers] = useState<Player[]>();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (checkLocationState(location, 'game', 'currentPlayer')) {
      setPlayers(location.state.game.players);
      setRoom(location.state.game.room);
      setCurrentPlayer(location.state.currentPlayer);
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [location, history]);

  const playAgain = () => {
    console.log(room);
    // TODO: send POST request (and only show this option to the host)
  };

  return (
    <Content>
      <LargeText>Winners</LargeText>
      {players?.map((player, index) => (
        <PlayerResultsCard
          player={player}
          place={index + 1}
          isCurrentPlayer={currentPlayer?.user.userId === player.user.userId}
          color="blue" // TODO: merge with Chris's PR
        />
      ))}

      <PrimaryButton onClick={playAgain}>Play Again?</PrimaryButton>
    </Content>
  );
}

export default GameResultsPage;
