import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createRoom, Room } from '../api/Room';
import { PrimaryButton } from '../components/core/Button';
import { isError } from '../api/Error';
import ErrorMessage from '../components/core/Error';

function CreateGamePage() {
  const history = useHistory();
  const [error, setError] = useState('');

  const redirectToGame = (room: Room) => {
    history.push('/game', { room });
  };

  const createNewRoom = useCallback(() => {
    createRoom()
      .then((res) => {
        if (isError(res)) {
          setError(res.message);
        } else {
          redirectToGame(res as Room);
        }
      });
  }, []);

  return (
    <div>
      {error ? <ErrorMessage message={error} /> : null}
      <PrimaryButton onClick={createNewRoom}>
        Create New Room
      </PrimaryButton>
    </div>
  );
}

export default CreateGamePage;
