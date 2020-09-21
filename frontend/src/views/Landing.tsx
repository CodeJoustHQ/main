import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextButton } from '../components/core/Button';
import { PrimaryButtonLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';
import { createRoom, Room } from '../api/Room';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';

function LandingPage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Callback used to create a new room and redirect to game page
  const createNewRoom = useCallback(() => {
    const redirectToGame = (room: Room) => {
      history.push('/game', { room });
    };

    setLoading(true);
    createRoom()
      .then((res) => {
        setLoading(false);
        redirectToGame(res);
      }).catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [history]);

  return (
    <div>
      <LandingHeaderText>
        Practice coding by competing against your friends.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/join">
        Join a Game
      </PrimaryButtonLink>
      <br />
      <TextButton onClick={createNewRoom}>
        Or create a room &#8594;
      </TextButton>
      {error ? <ErrorMessage message={error} /> : null}
      {loading ? <Loading /> : null}
    </div>
  );
}

export default LandingPage;
