import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message, Subscription } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, MediumText } from '../components/core/Text';
import { connect, routes, subscribe } from '../api/Socket';
import { User } from '../api/User';
import { checkLocationState, isValidRoomId } from '../util/Utility';
import Difficulty from '../api/Difficulty';
import { PrimaryButton, DifficultyButton, SmallButton } from '../components/core/Button';
import Loading from '../components/core/Loading';
import PlayerCard from '../components/card/PlayerCard';
import HostActionCard from '../components/card/HostActionCard';
import { startGame } from '../api/Game';
import {
  getRoom, Room, changeRoomHost, updateRoomSettings, removeUser,
} from '../api/Room';
import { NumberInput } from '../components/core/Input';

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
  const [activeUsers, setActiveUsers] = useState<User[] | null>(null);
  const [inactiveUsers, setInactiveUsers] = useState<User[] | null>(null);
  const [currentRoomId, setRoomId] = useState('');
  const [active, setActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [duration, setDuration] = useState(15);

  // Hold error text.
  const [error, setError] = useState('');

  // Hold loading boolean.
  const [loading, setLoading] = useState(false);

  // Variable to hold whether the user is connected to the socket.
  const [socketConnected, setSocketConnected] = useState(false);

  // Variable to hold the subscription return, which can be unsubscribed.
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  /**
   * Set state variables from an updated room object
   */
  const setStateFromRoom = (room: Room) => {
    setHost(room.host);
    setActiveUsers(room.activeUsers);
    setInactiveUsers(room.inactiveUsers);
    setRoomId(room.roomId);
    setActive(room.active);
    setDifficulty(room.difficulty);
  };

  const kickUser = (user: User) => {
    setLoading(true);
    removeUser(currentRoomId, {
      initiator: currentUser as User,
      userToDelete: user,
    })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const changeHosts = (newHost: User) => {
    const request = {
      initiator: currentUser!,
      newHost,
    };

    if (!loading) {
      setLoading(true);
      changeRoomHost(currentRoomId, request)
        .then(() => setLoading(false))
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const handleStartGame = () => {
    const request = { initiator: currentUser as User };
    startGame(currentRoomId, request)
      .then(() => {
        setLoading(true);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  /**
   * Update the difficulty setting of the room (EASY, MEDIUM, HARD, or RANDOM)
   */
  const updateDifficultySetting = (key: string) => {
    if (currentUser?.nickname === host?.nickname && !loading) {
      const oldDifficulty = difficulty;
      const newDifficulty = Difficulty[key as keyof typeof Difficulty];

      setLoading(true);
      // Preemptively set new difficulty value
      setDifficulty(newDifficulty);

      const newSettings = {
        initiator: currentUser!,
        difficulty: newDifficulty,
      };

      updateRoomSettings(currentRoomId, newSettings)
        .then(() => setLoading(false))
        .catch((err) => {
          setLoading(false);
          setError(err.message);
          // Set difficulty back to original if REST call failed
          setDifficulty(oldDifficulty);
        });
    }
  };

  /**
   * Update the room/game duration (in minutes)
   */
  const updateRoomDuration = () => {
    const prevDuration = duration;
    const settings = {
      initiator: currentUser!,
      duration: duration * 60,
    };

    updateRoomSettings(currentRoomId, settings)
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        // Set duration back to original if REST call failed
        setDuration(prevDuration);
      });
  };

  /**
   * Display the passed-in list of users on the UI, either as
   * active or inactive.
   */
  const displayUsers = (userList: User[] | null, isActive: boolean) => {
    if (userList) {
      return userList.map((user) => (
        <PlayerCard
          user={user}
          isHost={user.nickname === host?.nickname}
          isActive={isActive}
        >
          {currentUser?.nickname === host?.nickname
            && (user.nickname !== currentUser?.nickname) ? (
              // If currentUser is host, pass in an on-click action card for all other users
              <HostActionCard
                user={user}
                userIsActive={Boolean(user.sessionId)}
                onMakeHost={changeHosts}
                onRemoveUser={kickUser}
              />
            ) : null}
        </PlayerCard>
      ));
    }
    return null;
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
      setStateFromRoom(JSON.parse(result.body));
    };

    connect(roomId, userId).then(() => {
      subscribe(routes(roomId).subscribe, subscribeCallback).then((subscriptionParam) => {
        setSubscription(subscriptionParam);
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
          res.users.forEach((user: User) => {
            if (user.nickname === location.state.user.nickname) {
              setCurrentUser(user);
            }
          });
        })
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
  }, [location, socketConnected, history]);

  // Connect the user to the room.
  useEffect(() => {
    if (!socketConnected && currentRoomId && currentUser && currentUser.userId) {
      connectUserToRoom(currentRoomId, currentUser.userId);
    }
  }, [socketConnected, connectUserToRoom, currentRoomId, currentUser]);

  // Redirect user to game page if room is active.
  useEffect(() => {
    if (active) {
      subscription?.unsubscribe();
      history.push('/game', {
        roomId: currentRoomId,
        currentUser,
        difficulty,
      });
    }
  }, [history, active, currentUser, currentRoomId, difficulty, subscription]);

  // Render the lobby.
  return (
    <div>
      <LargeText>
        You have entered the lobby for room
        {' #'}
        {currentRoomId}
        ! Your nickname is &quot;
        {currentUser?.nickname}
        &quot;.
      </LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <div>
        {
          displayUsers(activeUsers, true)
        }
        {
          displayUsers(inactiveUsers, false)
        }
      </div>

      <MediumText>Difficulty Settings</MediumText>
      {Object.keys(Difficulty).map((key) => (
        <DifficultyButton
          onClick={() => updateDifficultySetting(key)}
          active={difficulty === Difficulty[key as keyof typeof Difficulty]}
          enabled={currentUser?.nickname === host?.nickname}
          title={currentUser?.nickname !== host?.nickname
            ? 'Only the host can change these settings' : undefined}
        >
          {key}
        </DifficultyButton>
      ))}

      <MediumText>Duration</MediumText>
      <NumberInput
        min={1}
        max={60}
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <SmallButton onClick={updateRoomDuration}>Save</SmallButton>

      <br />

      {currentUser?.nickname === host?.nickname
        ? <PrimaryButton onClick={handleStartGame} disabled={loading}>Start Game</PrimaryButton>
        : <MediumText>Waiting for the host to start the game...</MediumText>}
    </div>
  );
}

export default LobbyPage;
