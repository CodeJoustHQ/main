import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, UserNicknameText } from '../components/core/Text';
import {
  deleteUser, connect, routes, subscribe,
} from '../api/Socket';
import { Room } from '../api/Room';
import { User } from '../api/User';

type LobbyPageLocation = {
  user: User,
  room: Room
}

function LobbyPage() {
  const location = useLocation<LobbyPageLocation>();
  const history = useHistory();

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
  const connectUserToRoom = useCallback((roomId: string) => {
    connect(roomId).then(() => {
      subscribe(routes(roomId).subscribe, subscribeCallback).then(() => {
        setSocketConnected(true);
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    });
  }, []);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Grab the user and room information; otherwise, redirect to the join page
    if (location && location.state && location.state.user && location.state.room) {
      setNickname(location.state.user.nickname);
      setUsers(location.state.room.users);
    } else {
      history.push('/game/join');
    }

    // Connect the user to the room.
    if (!socketConnected && nickname) {
      connectUserToRoom(location.state.room.roomId);
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
