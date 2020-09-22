import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, UserNicknameText } from '../components/core/Text';
import {
  addUser, deleteUser, connect, routes, subscribe, User,
} from '../api/Socket';
import ErrorMessage from '../components/core/Error';

type WaitingRoomPageProps = {
  nickname: string;
}

function WaitingRoomPage() {
  const location = useLocation<WaitingRoomPageProps>();
  const { nickname } = location.state;

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to hold the users on the page.
  const [users, setUsers] = useState<User[]>([]);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  // Dummy room id for dynamic room endpoint purposes
  const socketRoomId = '791894';

  /**
   * Nickname that is populated if the join page is on the waiting room stage.
   * Set error if no nickname is passed in despite the waiting room stage.
   */
  if ((!location || !location.state || !location.state.nickname) && !error) {
    setError('No nickname was provided for the user in the waiting room.');
  }

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
  const connectUserToRoom = (roomId: string, nicknameParam: string) => {
    connect(roomId).then(() => {
      subscribe(routes(roomId).subscribe, subscribeCallback).then(() => {
        try {
          addUser(nicknameParam);
          setSocketConnected(true);
        } catch (err) {
          setError(err.message);
        }
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    });
  };

  /**
   * If the user is on the waiting room page state but not connected:
   * add the user to the waiting room (which connects them to the socket).
   * (This occurs when the create page redirects the user to the waiting page.)
   */
  if (!socketConnected && nickname) {
    connectUserToRoom(socketRoomId, nickname);
  }

  // Render the Waiting room state.
  return (
    <div>
      <LargeText>
        You have entered the waiting room! Your nickname is &quot;
        {nickname}
        &quot;.
      </LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      <div>
        {
          users.map((user) => (
            <UserNicknameText onClick={(event) => {
              deleteUser((event.target as HTMLElement).innerText);
            }}
            >
              {user.nickname}
            </UserNicknameText>
          ))
        }
      </div>
    </div>
  );
}

export default WaitingRoomPage;
