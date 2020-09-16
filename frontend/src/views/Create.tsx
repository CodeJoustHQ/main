import React, { useState, ReactElement, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { connect, SOCKET_ENDPOINT, User } from '../api/Socket';
import { createRoom, Room } from '../api/Room';
import { isError } from '../api/Error';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const [error, setError] = useState('');

  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  // Callback used to create a new room and redirect to game page
  const enterNicknameAction = () => {
    const redirectToWaitingRoom = (room: Room, initialUsers: User[],
      initialPageState: number, initialNickname: string) => {
      history.push(`/game/join?room=${room.roomId}`,
        { initialUsers, initialPageState, initialNickname });
    };

    createRoom()
      .then((res) => {
        // Type guard used to differentiate between success/failure responses
        if (isError(res)) {
          setError(res.message);
        } else {
          connect(SOCKET_ENDPOINT, nickname).then((result) => {
            console.log(result);
            const pageState: number = 2;
            const users: User[] = result;
            redirectToWaitingRoom(res as Room, users, pageState, nickname);
          }).catch((response) => {
            setError(response.message);
          });
        }
      });
  };

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
