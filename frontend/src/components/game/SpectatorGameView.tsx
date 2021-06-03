/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import { Message, Subscription } from 'stompjs';
import { Game, Player } from '../../api/Game';
import { routes, subscribe } from '../../api/Socket';
import { useAppSelector } from '../../util/Hook';
import { CenteredContainer } from '../core/Container';
import ErrorMessage from '../core/Error';
import Modal from '../core/Modal';
import { LargeCenterText } from '../core/Text';
import PreviewCodeContent from '../results/PreviewCodeContent';
import ResultsTable from '../results/ResultsTable';

function SpectatorGameView() {
  const { currentUser, game } = useAppSelector((state) => state);

  const [codeModal, setCodeModal] = useState(-1);
  const [playerSocket, setPlayerSocket] = useState<Subscription | null>();
  const [viewPlayer, setViewPlayer] = useState<Player | null>();
  const [viewGame, setViewGame] = useState<Game | null>();
  const [error, setError] = useState<string>('');

  // Unsubscribe from the player socket.
  const unsubscribePlayer = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    playerSocket?.unsubscribe();
  }, [playerSocket]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    // If the spectator is currently subscribed, unsubscribe them.
    if (playerSocket) {
      unsubscribePlayer();
    }

    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      // Create the new type here.
      const updatedGame: Game = JSON.parse(result.body);

      // There could be a special "view" type used for this.
      // TODO: Include cursor location?
      setViewGame(updatedGame);
    };

    subscribe(routes(roomIdParam, userIdParam).subscribe_player, subscribePlayerCallback)
      .then((subscription) => {
        setPlayerSocket(subscription);
      }).catch((err) => {
        setError(err.message);
      });
  }, [playerSocket, unsubscribePlayer]);

  return (
    <>
      <Modal show={codeModal !== -1} onExit={() => setCodeModal(-1)} fullScreen>
        <PreviewCodeContent
          player={game?.players[codeModal]}
        />
      </Modal>
      <LargeCenterText>Live Scoreboard</LargeCenterText>
      <ResultsTable
        players={game?.players || []}
        currentUser={currentUser}
        gameStartTime={game?.gameTimer.startTime || ''}
        viewPlayerCode={(index: number) => setCodeModal(index)}
      />
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
    </>
  );
}

export default SpectatorGameView;
