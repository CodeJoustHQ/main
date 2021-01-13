import React from 'react';
import { useLocation } from 'react-router-dom';
import { LargeText } from '../components/core/Text';
import { Game } from '../api/Game';

type LocationState = {
  game: Game,
};

function GameResultsPage() {
  const location = useLocation<LocationState>();

  return (
    <div>
      <LargeText>Winners</LargeText>
    </div>
  );
}

export default GameResultsPage;
