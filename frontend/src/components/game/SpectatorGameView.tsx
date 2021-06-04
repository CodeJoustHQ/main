import React, { useState } from 'react';
import { useAppSelector } from '../../util/Hook';
import Modal from '../core/Modal';
import { LargeCenterText } from '../core/Text';
import PreviewCodeContent from '../results/PreviewCodeContent';
import ResultsTable from '../results/ResultsTable';

function SpectatorGameView() {
  const { currentUser, game } = useAppSelector((state) => state);

  const [codeModal, setCodeModal] = useState(-1);

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
    </>
  );
}

export default SpectatorGameView;
