import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, UserNicknameText } from '../components/core/Text';
import {
  addUser, SUBSCRIBE_URL, connect,
  deleteUser, SOCKET_ENDPOINT, subscribe, User,
} from '../api/Socket';
import ErrorMessage from '../components/core/Error';

type LobbyPageLocation = {
  nickname: string;
}

function LobbyPage() {
  const location = useLocation<LobbyPageLocation>();
  let nickname: string = '';
  if (location && location.state && location.state.nickname) {
    nickname = location.state.nickname;
  }

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to hold the users on the page.
  const [users, setUsers] = useState<User[]>([]);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  /**
   * Nickname that is populated if the join page is on the lobby stage.
   * Set error if no nickname is passed in despite the lobby stage.
   */
  if (!nickname && !error) {
    setError('No nickname was provided for the user in the lobby.');
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
   * Add the user to the lobby through the following steps.
   * 1. Connect the user to the socket.
   * 2. Subscribe the user to future messages.
   * 3. Send the user nickname to the room.
   * 4. Update the room layout to the "lobby" page.
   * This method returns a Promise which is used to trigger setLoading
   * and setError on the EnterNickname page following this function.
   */
  const connectUserToRoom = (socketEndpoint: string, subscribeUrl: string,
    nicknameParam: string) => {
    connect(socketEndpoint).then(() => {
      subscribe(subscribeUrl, subscribeCallback).then(() => {
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
   * If the user is on the lobby page state but not connected:
   * add the user to the lobby (which connects them to the socket).
   * (This occurs when the create page redirects the user to the lobby.)
   */
  if (!socketConnected && nickname) {
    connectUserToRoom(SOCKET_ENDPOINT, SUBSCRIBE_URL, nickname);
  }

  // Render the lobby.
  return (
    <div>
      <LargeText>
        You have entered the lobby! Your nickname is &quot;
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

export default LobbyPage;
