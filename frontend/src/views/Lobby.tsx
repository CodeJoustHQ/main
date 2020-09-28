import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Message } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, UserNicknameText } from '../components/core/Text';
import { connect, routes, subscribe } from '../api/Socket';
import { Room } from '../api/Room';
import { User } from '../api/User';

type LobbyPageLocation = {
  user: User,
  room: Room,
};

function LobbyPage() {
  const location = useLocation<LobbyPageLocation>();

  // Set the nickname variable.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to determine whether to redirect back to join page
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Variable to hold the users on the page.
  const [room, setRoom] = useState<Room | null>(null);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  /**
   * Subscribe callback that will be triggered on every message.
   * Update the users list.
   */
  const subscribeCallback = (result: Message) => {
    const newRoom:Room = JSON.parse(result.body);
    setRoom(newRoom);
  };

  const deleteUser = (user: User) => {
    // Make rest call to delete user from room
    console.log(user);
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
      setCurrentUser(location.state.user);
      setRoom(location.state.room);
    } else {
      setShouldRedirect(true);
    }

    // Connect the user to the room.
    if (!socketConnected && room !== null) {
      connectUserToRoom(room.roomId);
    }
  }, [location, socketConnected, room, connectUserToRoom]);

  // Render the lobby.
  return (
    <div>
      { shouldRedirect ? (
        // Using redirect instead of history prevents the back button from breaking
        <Redirect
          to={{
            pathname: '/game/join',
            state: { error: 'Please join a room to access the lobby page.' },
          }}
        />
      ) : null}
      <LargeText>
        You have entered the lobby for room
        {' '}
        {room?.roomId}
        ! Your nickname is &quot;
        {currentUser?.nickname}
        &quot;.
      </LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      <div>
        {
          room?.users.map((user) => (
            <UserNicknameText onClick={() => deleteUser(user)}>
              {user.nickname}
            </UserNicknameText>
          ))
        }
      </div>
    </div>
  );
}

export default LobbyPage;
