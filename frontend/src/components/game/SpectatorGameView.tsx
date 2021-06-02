import React, { useState } from 'react';
import { Player } from '../../api/Game';
import { User } from '../../api/User';
import Modal from '../core/Modal';
import { LargeCenterText } from '../core/Text';
import PreviewCodeContent from '../results/PreviewCodeContent';
import ResultsTable from '../results/ResultsTable';

type SpectatorGameViewProps = {
  players: Player[],
  currentUser: User,
  startTime: string,
}

function SpectatorGameView(props: SpectatorGameViewProps) {
  const { players, currentUser, startTime } = props;

  const [codeModal, setCodeModal] = useState(-1);

  return (
    <>
      <Modal show={codeModal !== -1} onExit={() => setCodeModal(-1)} fullScreen>
        <PreviewCodeContent
          player={players[codeModal]}
        />
      </Modal>
      <LargeCenterText>Live Scoreboard</LargeCenterText>
      <ResultsTable
        players={players}
        currentUser={currentUser}
        gameStartTime={startTime}
        viewPlayerCode={(index: number) => setCodeModal(index)}
      />
    </>
  );
}

export default SpectatorGameView;
