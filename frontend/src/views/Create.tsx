import React from 'react';
import { useHistory } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';
import { createRoom, Room, CreateRoomParams } from '../api/Room';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  // Creates a room with the user as the host, and joins that same lobby.
  const createJoinLobby = (nickname: string) => new Promise<undefined>((resolve, reject) => {
    const redirectToLobby = (room: Room) => {
      history.push(`/game/lobby?room=${room.roomId}`, { nickname });
    };

    const roomHost: CreateRoomParams = {
      host: {
        nickname,
      },
    };
    createRoom(roomHost)
      .then((res) => {
        redirectToLobby(res);
        resolve();
      }).catch((err) => reject(err));
  });

  // Render the "Enter nickname" state.
  return (
    <EnterNicknamePage
      enterNicknameHeaderText="Enter a nickname to create the game!"
      enterNicknameAction={createJoinLobby}
    />
  );
}

export default CreateGamePage;
