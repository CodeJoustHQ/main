import React from 'react';
import { useHistory } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';
import { createRoom, Room, CreateRoomParams } from '../api/Room';
import { User } from '../api/User';
import { useAppDispatch } from '../util/Hook';
import { setRoom } from '../redux/Room';
import { setCurrentUser } from '../redux/User';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const dispatch = useAppDispatch();

  // Creates a room with the user as the host, and joins that same lobby.
  const createJoinLobby = (nickname: string) => new Promise<void>((resolve, reject) => {
    const redirectToLobby = (room: Room, user: User) => {
      history.push(`/game/lobby?room=${room.roomId}`, { user, roomId: room.roomId });
    };

    const roomHost: CreateRoomParams = {
      host: {
        nickname,
      },
    };
    createRoom(roomHost)
      .then((res) => {
        dispatch(setRoom(res));
        dispatch(setCurrentUser(res.host));

        redirectToLobby(res, res.host);
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
