import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Message } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import {
  LargeText, UserNicknameText, InactiveUserNicknameText, MediumText,
} from '../components/core/Text';
import { connect, routes, subscribe } from '../api/Socket';
import { getRoom, Room } from '../api/Room';
import { User } from '../api/User';
import { errorHandler } from '../api/Error';
import { checkLocationState } from '../util/Utility';

type LobbyPageLocation = {
  user: User,
  roomId: string,
};

function LobbyPage() {
  const location = useLocation<LobbyPageLocation>();

  // Set the current user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set all the different variables in the room object
  const [host, setHost] = useState<User | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[] | null>(null);
  const [inactiveUsers, setInactiveUsers] = useState<User[] | null>(null);
  const [currentRoomId, setRoomId] = useState('');

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to determine whether to redirect back to join page
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  /**
   * Set state variables from an updated room object
   */
  const setStateFromRoom = (room: Room) => {
    setHost(room.host);
    setActiveUsers(room.activeUsers);
    setInactiveUsers(room.inactiveUsers);
    setRoomId(room.roomId);
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
  const connectUserToRoom = useCallback((roomId: string, userId: string) => {
    /**
     * Subscribe callback that will be triggered on every message.
     * Update the users list and other room info.
     */
    const subscribeCallback = (result: Message) => {
      console.log(result);
      setStateFromRoom(JSON.parse(result.body));
    };

    connect(roomId, userId).then(() => {
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
    if (checkLocationState(location, 'user', 'roomId')) {
      // Call GET endpoint to get latest room info
      getRoom(location.state.roomId)
        .then((res) => {
          setStateFromRoom(res);
          // Reset the user to hold the ID.
          res.inactiveUsers.forEach((user: User) => {
            if (user.nickname === location.state.user.nickname) {
              setCurrentUser(user);
            }
          });
        })
        .catch((err) => setError(err));
    } else {
      setShouldRedirect(true);
    }
  }, [location, socketConnected, connectUserToRoom]);

  // Connect the user to the room.
  useEffect(() => {
    if (!socketConnected && currentRoomId && currentUser && currentUser.userId) {
      connectUserToRoom(currentRoomId, currentUser.userId);
    }
  }, [currentRoomId, currentUser]);

  // Render the lobby.
  return (
    <div>
      { shouldRedirect ? (
        // Using redirect instead of history prevents the back button from breaking
        <Redirect
          to={{
            pathname: '/game/join',
            state: { error: errorHandler('Please join a room to access the lobby page.') },
          }}
        />
      ) : null}
      <LargeText>
        You have entered the lobby for room
        {' '}
        {currentRoomId}
        ! Your nickname is &quot;
        {currentUser?.nickname}
        &quot;.
      </LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      <div>
        {
          activeUsers?.map((user) => (
            <UserNicknameText onClick={() => deleteUser(user)}>
              {user.nickname}
              {user.nickname === host?.nickname ? ' (host)' : ''}
            </UserNicknameText>
          ))
        }
      </div>
      <div>
        <MediumText>Below is a list of inactive users.</MediumText>
        {
          inactiveUsers?.map((user) => (
            <InactiveUserNicknameText onClick={() => deleteUser(user)}>
              {user.nickname}
              {user.nickname === host?.nickname ? ' (host)' : ''}
            </InactiveUserNicknameText>
          ))
        }
      </div>
    </div>
  );
}

export default LobbyPage;
