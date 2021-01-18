import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message, Subscription } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, MediumText, Text } from '../components/core/Text';
import {
  connect, routes, subscribe, disconnect,
} from '../api/Socket';
import { User } from '../api/User';
import { checkLocationState, isValidRoomId } from '../util/Utility';
import Difficulty from '../api/Difficulty';
import { PrimaryButton, DifficultyButton } from '../components/core/Button';
import Loading from '../components/core/Loading';
import PlayerCard from '../components/card/PlayerCard';
import HostActionCard from '../components/card/HostActionCard';
import { startGame } from '../api/Game';
import {
  getRoom, Room, changeRoomHost, updateRoomSettings, removeUser,
} from '../api/Room';
import { NumberInput } from '../components/core/Input';
import { errorHandler } from '../api/Error';

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
  const [duration, setDuration] = useState<number | undefined>(15);

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
    setDuration(room.duration / 60);
  };

  // Function to determine if the given user is the host or not
  const isHost = useCallback((user: User | null) => user?.userId === host?.userId, [host]);

  const kickUser = (user: User) => {
    setLoading(true);
    setError('');
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

  /**
   * If the user is not present in the room after a refresh, then
   * disconnect them and boot them off the page, as they were kicked.
   *
   * @param roomParam The updated room to check for kicked user.
   * @param currentUser The updated room to check for kicked user.
   */
  const conditionallyBootKickedUser = useCallback((roomParam: Room,
    currentUserParam: User | null) => {
    if (currentUserParam) {
      let userIncluded: boolean = false;
      roomParam.users.forEach((user) => {
        if (currentUserParam.userId === user.userId) {
          userIncluded = true;
        }
      });
      // If user is no longer present in room, boot the user.
      if (!userIncluded) {
        disconnect().then(() => {
          history.replace('/game/join', {
            error: errorHandler('You have been kicked from the room.'),
          });
          setSocketConnected(false);
          setLoading(false);
        }).catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      }
    }
  }, [history]);

  /**
   * Reset the user to hold the ID (location currently has
   * only nickname). Boot user if not present in list.
   * Only go through process if current user is not yet set.
   */
  const updateCurrentUserDetails = useCallback((usersParam: User[]) => {
    if (!currentUser) {
      let userFound: boolean = false;
      usersParam.forEach((user: User) => {
        if (user.nickname === location.state.user.nickname) {
          setCurrentUser(user);
          userFound = true;
        }
      });

      // If user is not found in list, redirect them to join page with error.
      if (!userFound) {
        history.replace('/game/join', {
          error: errorHandler('You could not be found in the room\'s list of users.'),
        });
      }
    }
  }, [currentUser, history, location]);

  const changeHosts = (newHost: User) => {
    setError('');
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
    setError('');
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
    setError('');
    if (isHost(currentUser) && !loading) {
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
    setError('');
    setLoading(true);
    const prevDuration = duration;
    const settings = {
      initiator: currentUser!,
      duration: (duration || 0) * 60,
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
          isHost={isHost(user)}
          isActive={isActive}
        >
          {isHost(currentUser) && (user.userId !== currentUser?.userId) ? (
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
     * Boot any kicked users that are no longer present in the room.
     */
    const subscribeCallback = (result: Message) => {
      const room: Room = JSON.parse(result.body);
      setStateFromRoom(room);
      conditionallyBootKickedUser(room, currentUser);
    };

    connect(roomId, userId).then(() => {
      // Body encrypt through JSON.
      subscribe(routes(roomId).subscribe_user, subscribeCallback).then((subscriptionParam) => {
        setSubscription(subscriptionParam);
        setSocketConnected(true);
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    });
  }, [currentUser, conditionallyBootKickedUser]);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Grab the user and room information; otherwise, redirect to the join page
    if (checkLocationState(location, 'user', 'roomId')) {
      // Call GET endpoint to get latest room info
      getRoom(location.state.roomId)
        .then((res) => {
          setStateFromRoom(res);
          updateCurrentUserDetails(res.users);
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
  }, [location, socketConnected, history, updateCurrentUserDetails]);

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
          enabled={isHost(currentUser)}
          title={!isHost(currentUser) ? 'Only the host can change these settings' : undefined}
        >
          {key}
        </DifficultyButton>
      ))}

      <MediumText>Duration</MediumText>
      <Text>
        {isHost(currentUser) ? 'Choose a game duration between 1-60 minutes:'
          : 'The game will last for the following minutes:'}
      </Text>
      <NumberInput
        min={1}
        max={60}
        value={duration}
        disabled={!isHost(currentUser)}
        onKeyPress={(e) => {
          // Prevent user from using any of these non-numeric characters
          if (e.key === 'e' || e.key === '.' || e.key === '-') {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const { value } = e.target;

          // Set duration to undefined to allow users to clear field
          if (!value) {
            setDuration(undefined);
          } else {
            const newDuration = Number(value);
            if (newDuration >= 0 && newDuration <= 60) {
              setDuration(newDuration);
            }
          }
        }}
        onBlur={updateRoomDuration}
      />
      <br />

      {isHost(currentUser)
        ? <PrimaryButton onClick={handleStartGame} disabled={loading}>Start Game</PrimaryButton>
        : <MediumText>Waiting for the host to start the game...</MediumText>}
    </div>
  );
}

export default LobbyPage;
