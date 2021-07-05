import React, { useCallback, useState } from 'react';
import { Message, Subscription } from 'stompjs';
import { SpectateGame } from '../../api/Game';
import { routes, send, subscribe } from '../../api/Socket';
import { useAppSelector } from '../../util/Hook';
import { CenteredContainer } from '../core/Container';
import ErrorMessage from '../core/Error';
import Loading from '../core/Loading';
import { LargeCenterText } from '../core/Text';
import ResultsTable from '../results/ResultsTable';
import PlayerGameView from './PlayerGameView';

function SpectatorGameView() {
  const { currentUser, game } = useAppSelector((state) => state);

  const [playerSocket, setPlayerSocket] = useState<Subscription | null>();
  const [spectateGame, setSpectateGame] = useState<SpectateGame | null>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [problemIndex, setProblemIndex] = useState(0);

  // Unsubscribe from the player socket.
  const unsubscribePlayer = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    playerSocket?.unsubscribe();
    setSpectateGame(null);
  }, [playerSocket]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    setLoading(true);

    // If the spectator is currently subscribed, unsubscribe them.
    if (playerSocket) {
      unsubscribePlayer();
    }

    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      if (!JSON.parse(result.body).newSpectator) {
        const updatedSpectateGame: SpectateGame = JSON.parse(result.body);
        console.log('in spectator page');
        console.log(updatedSpectateGame);
        setSpectateGame(updatedSpectateGame);
      }
    };

    subscribe(routes(roomIdParam, userIdParam).subscribe_player, subscribePlayerCallback)
      .then((subscription) => {
        setPlayerSocket(subscription);

        // Send socket message to inform player new spectator is present.
        const newSpectator: string = JSON.stringify({
          newSpectator: true,
        });
        send(routes(roomIdParam, userIdParam).subscribe_player, {}, newSpectator);
        setError('');
      }).catch((err) => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [playerSocket, unsubscribePlayer]);

  // Display the spectate player view if currently viewing another player.
  if (playerSocket && spectateGame) {
    return (
      <PlayerGameView
        gameError={error}
        spectateGame={spectateGame}
        spectatorUnsubscribePlayer={unsubscribePlayer}
        defaultIndex={problemIndex}
      />
    );
  }

  return (
    <>
      <LargeCenterText>Live Scoreboard</LargeCenterText>
      <ResultsTable
        players={game?.players || []}
        currentUser={currentUser}
        gameStartTime={game?.gameTimer.startTime || ''}
        viewPlayerCode={null}
        spectatePlayer={(playerUserId: string, probIndex: number) => {
          const player = game?.players.find((p) => p.user.userId === playerUserId);
          if (game && player) {
            setProblemIndex(probIndex);
            subscribePlayer(game.room.roomId, player.user.userId!);
          }
        }}
        problems={game?.problems || []}
      />
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
      {loading ? <CenteredContainer><Loading /></CenteredContainer> : null}
    </>
  );
}

export default SpectatorGameView;
