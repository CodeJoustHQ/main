import React from 'react';
import { useHistory } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';
import { createRoom, Room, CreateRoomParams } from '../api/Room';
import { User } from '../api/User';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  // Creates a room with the user as the host, and joins that same lobby.
  const createJoinLobby = (nickname: string) => new Promise<undefined>((resolve, reject) => {
    const redirectToLobby = (room: Room, user: User) => {
      history.push(`/game/lobby?room=${room.roomId}`, { user, room });
    };

    const roomHost: CreateRoomParams = {
      host: {
        nickname,
      },
    };
    createRoom(roomHost)
      .then((res) => {
        redirectToLobby(res, roomHost.host);
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
