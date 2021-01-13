import React, {useEffect, useState} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { LargeText } from '../components/core/Text';
import { Game, Player } from '../api/Game';
import { checkLocationState } from '../util/Utility';
import { errorHandler } from '../api/Error';

type LocationState = {
  game: Game,
};

function GameResultsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [players, setPlayers] = useState<Player[]>();

  useEffect(() => {
    if (checkLocationState(location, 'game')) {
      setPlayers(location.state.game.players);
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [location, history]);

  return (
    <div>
      <LargeText>Winners</LargeText>
    </div>
  );
}

export default GameResultsPage;
