import React, { useCallback, useEffect, useState } from 'react';
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

  // Set the nickname variable.
  const [nickname, setNickname] = useState('');

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to hold the users on the page.
  const [users, setUsers] = useState<User[]>([]);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

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
   * This method uses useCallback so it is not re-built in
   * the useEffect function.
   */
  const connectUserToRoom = useCallback((socketEndpoint: string,
    subscribeUrl: string, nicknameParam: string) => {
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
  }, []);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Grab the nickname variable; otherwise, set an error.
    if (location && location.state && location.state.nickname) {
      setNickname(location.state.nickname);
    } else {
      setError('No nickname was provided for the user in the lobby.');
    }

    // Connect the user to the room.
    if (!socketConnected && nickname) {
      connectUserToRoom(SOCKET_ENDPOINT, SUBSCRIBE_URL, nickname);
    }
  }, [location, socketConnected, nickname, connectUserToRoom]);

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
