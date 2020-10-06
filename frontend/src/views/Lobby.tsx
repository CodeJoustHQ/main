import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, MediumText, UserNicknameText } from '../components/core/Text';
import { connect, routes, subscribe } from '../api/Socket';
import { getRoom, Room } from '../api/Room';
import { User } from '../api/User';
import { checkLocationState, isValidRoomId } from '../util/Utility';
import { PrimaryButton } from '../components/core/Button';
import Loading from '../components/core/Loading';
import { startGame } from '../api/Game';

type LobbyPageLocation = {
  user: User,
  roomId: string,
};

function LobbyPage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LobbyPageLocation>();

  // Set the current user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set all the different variables in the room object
  const [host, setHost] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [currentRoomId, setRoomId] = useState('');

  // Hold error text.
  const [error, setError] = useState('');
  
  // Hold loading boolean.
  const [loading, setLoading] = useState(false);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  /**
   * Set state variables from an updated room object
   */
  const setStateFromRoom = (room: Room) => {
    setHost(room.host);
    setUsers(room.users);
    setRoomId(room.roomId);
  };

  const deleteUser = (user: User) => {
    // Make rest call to delete user from room
    console.log(user);
  };

  const handleClick = () => {
    const request = { roomId: currentRoomId, initiator: currentUser as User };
    startGame(request)
      .then(() => {
        setLoading(true);
      })
      .catch((err) => {
        setError(err.message);
      });
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
    /**
     * Subscribe callback that will be triggered on every message.
     * Update the users list and other room info.
     */
    const subscribeCallback = (result: Message) => {
      setStateFromRoom(JSON.parse(result.body));
    };

    const startGameCallback = () => {
      history.push('/game');
    };

    connect(roomId).then(() => {
      subscribe(routes(roomId).subscribe, subscribeCallback).then(() => {
        setSocketConnected(true);
      }).catch((err) => {
        setError(err.message);
      });
      subscribe(routes(roomId).start, startGameCallback).then(() => {
        setSocketConnected(true);
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    });
  }, [history]);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Grab the user and room information; otherwise, redirect to the join page
    if (checkLocationState(location, 'user', 'roomId')) {
      setCurrentUser(location.state.user);

      // Call GET endpoint to get latest room info
      getRoom(location.state.roomId)
        .then((res) => setStateFromRoom(res))
        .catch((err) => setError(err));
    } else {
      // Get URL query params to determine if the roomId is provided.
      const urlParams = new URLSearchParams(window.location.search);
      const roomIdQueryParam: string | null = urlParams.get('room');
      if (roomIdQueryParam && isValidRoomId(roomIdQueryParam)) {
        setRoomId(roomIdQueryParam);
        history.replace(`/game/join?room=${roomIdQueryParam}`);
      } else {
        history.replace('/game/join');
      }
    }

    // Connect the user to the room.
    if (!socketConnected && currentRoomId && currentUser) {
      connectUserToRoom(currentRoomId);
    }
  }, [location, socketConnected, currentRoomId, history, currentUser, connectUserToRoom]);

  // Render the lobby.
  return (
    <div>
      { loading ? <Loading /> : null }
      <LargeText>
        You have entered the lobby for room
        {' #'}
        {currentRoomId}
        ! Your nickname is &quot;
        {currentUser?.nickname}
        &quot;.
      </LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      <div>
        {
          users?.map((user) => (
            <UserNicknameText onClick={() => deleteUser(user)}>
              {user.nickname}
              {user.nickname === host?.nickname ? ' (host)' : ''}
            </UserNicknameText>
          ))
        }
      </div>
      {currentUser?.nickname === host?.nickname
        ? <PrimaryButton onClick={handleClick}> Start Game </PrimaryButton>
        : <MediumText>Waiting for the host to start the game...</MediumText>}
    </div>
  );
}

export default LobbyPage;
