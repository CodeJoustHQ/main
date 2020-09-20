import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import { connect, SOCKET_ENDPOINT, User } from '../api/Socket';
import { createRoom, Room } from '../api/Room';

function CreateGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

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
          redirectToWaitingRoom(res, connectUsers, 2, nickname);
          resolve();
        }).catch((err) => {
          reject(errorHandler(err.message));
        });
      }).catch((err) => {
        reject(errorHandler(err.message));
      });
  });

  /**
   * Subscribe callback that will be triggered on every message.
   * Update the users list.
   */
  const subscribeCallback = (result: Message) => {
    const userObjects:User[] = JSON.parse(result.body);
    setUsers(userObjects);
  };

  /**
   * Add the user to the waiting room through the following steps.
   * 1. Connect the user to the socket.
   * 2. Subscribe the user to future messages.
   * 3. Send the user nickname to the room.
   * 4. Update the room layout to the "waiting room" page.
   * This method returns a Promise which is used to trigger setLoading
   * and setError on the EnterNickname page following this function.
   */
  const addUserToWaitingRoom = (socketEndpoint: string,
    subscribeUrl: string, nicknameParam: string) => new Promise<undefined>((resolve, reject) => {
      connect(socketEndpoint).then(() => {
        subscribe(subscribeUrl, subscribeCallback).then(() => {
          try {
            addUser(nicknameParam);
            setPageState(2);
            resolve();
          } catch (err) {
            reject(errorHandler(err.message));
          }
        }).catch((err) => {
          reject(errorHandler(err.message));
        });
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
