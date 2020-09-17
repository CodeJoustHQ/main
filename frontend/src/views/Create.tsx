import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { connect, SOCKET_ENDPOINT, User } from '../api/Socket';
import { createRoom, Room } from '../api/Room';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  // Callback used to create a new room and redirect to game page
  const enterNicknameAction = () => new Promise<undefined>((resolve, reject) => {
    const redirectToWaitingRoom = (room: Room, initialUsers: User[],
      initialPageState: number, initialNickname: string) => {
      history.push(`/game/join?room=${room.roomId}`,
        { initialUsers, initialPageState, initialNickname });
    };

    createRoom()
      .then((res) => {
        connect(SOCKET_ENDPOINT, nickname).then((connectUsers) => {
          redirectToWaitingRoom(res as Room, connectUsers, 2, nickname);
          resolve();
        }).catch((err) => {
          reject(err.message);
        });
      }).catch((err) => {
        reject(err.message);
      });
  });

  // Render the "Enter nickname" state.
  return (
    <div>
      <EnterNicknamePage
        nickname={nickname}
        setNickname={setNickname}
        enterNicknamePage={ENTER_NICKNAME_PAGE.CREATE}
        enterNicknameAction={enterNicknameAction}
      />
    </div>
  );
}

export default CreateGamePage;
