import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createRoom, Room } from '../api/Room';
import { PrimaryButton } from '../components/core/Button';
import { isError } from '../api/Error';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';

function CreateGamePage() {
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
      {error ? <ErrorMessage message={error} /> : null}
      {loading ? <Loading /> : null}
      <PrimaryButton onClick={createNewRoom}>
        Create New Room
      </PrimaryButton>
    </div>
  );
}

export default CreateGamePage;
