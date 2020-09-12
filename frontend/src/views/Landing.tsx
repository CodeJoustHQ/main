import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextButton } from '../components/core/Button';
import { PrimaryButtonLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';
import { createRoom, Room } from '../api/Room';
import { isError } from '../api/Error';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';

function LandingPage() {
  const history = useHistory();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createNewRoom = useCallback(() => {
    const redirectToGame = (room: Room) => {
      history.push('/game', { room });
    };

    setLoading(true);
    createRoom()
      .then((res) => {
        setLoading(false);
        if (isError(res)) {
          setError(res.message);
        } else {
          redirectToGame(res as Room);
        }
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
