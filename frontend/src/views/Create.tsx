import React, { useCallback, useState } from 'react';
import { createRoom } from '../api/Room';
import { PrimaryButton } from '../components/core/Button';
import { Text } from '../components/core/Text';

function CreateGamePage() {
  const [roomId, setRoomId] = useState('');

  const createNewRoom = useCallback(() => {
    createRoom()
      .then((res) => {
        console.log(res);
        setRoomId(res.roomId);
      });
  }, []);

  return (
    <div>
      Create game page

      <PrimaryButton onClick={createNewRoom}>
        Create New Room
      </PrimaryButton>

      <Text>
        {roomId}
      </Text>
    </div>
  );
}

export default CreateGamePage;
