import React from 'react';
import { useHistory } from 'react-router-dom';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import { createRoom, Room } from '../api/Room';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  // Callback used to create a new room and redirect to game page
  const enterNicknameAction = (nickname: string) => new Promise<undefined>((resolve, reject) => {
    const redirectToWaitingRoom = (room: Room, initialPageState: number,
      initialNickname: string) => {
      history.push(`/game/join?room=${room.roomId}`,
        { initialPageState, initialNickname });
    };

    createRoom()
      .then((res) => {
        redirectToWaitingRoom(res, 2, nickname);
      }).catch((err) => {
        reject(errorHandler(err.message));
      });
  });

  // Render the "Enter nickname" state.
  return (
    <div>
      <EnterNicknamePage
        enterNicknamePageType={ENTER_NICKNAME_PAGE.CREATE}
        enterNicknameAction={enterNicknameAction}
      />
    </div>
  );
}

export default CreateGamePage;
