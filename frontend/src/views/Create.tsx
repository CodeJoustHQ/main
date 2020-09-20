import React from 'react';
import { useHistory } from 'react-router-dom';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import { createRoom, Room, RoomParams } from '../api/Room';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  // Creates a room with the user as the host, and joins that same waiting room.
  const createJoinWaitingRoom = (nickname: string) => new Promise<undefined>((resolve, reject) => {
    const redirectToWaitingRoom = (room: Room, initialPageState: number,
      initialNickname: string) => {
      history.push(`/game/join?room=${room.roomId}`,
        { initialPageState, initialNickname });
    };

    const roomHost: RoomParams = {
      host: {
        nickname,
      },
    };
    createRoom(roomHost)
      .then((res) => {
        redirectToWaitingRoom(res, 2, nickname);
        resolve();
      }).catch((err) => {
        reject(errorHandler(err.message));
      });
  });

  // Render the "Enter nickname" state.
  return (
    <div>
      <EnterNicknamePage
        enterNicknamePageType={ENTER_NICKNAME_PAGE.CREATE}
        enterNicknameAction={createJoinWaitingRoom}
      />
    </div>
  );
}

export default CreateGamePage;
