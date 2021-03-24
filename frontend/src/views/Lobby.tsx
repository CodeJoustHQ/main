import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message, Subscription } from 'stompjs';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import ErrorMessage from '../components/core/Error';
import {
  NoMarginMediumText,
  MainHeaderText,
  SmallHeaderText,
  NoMarginSubtitleText,
} from '../components/core/Text';
import {
  connect, routes, subscribe, disconnect,
} from '../api/Socket';
import { User } from '../api/User';
import { checkLocationState, isValidRoomId } from '../util/Utility';
import { Difficulty } from '../api/Difficulty';
import {
  PrimaryButton,
  SmallDifficultyButton,
  InlineRefreshIcon,
  SecondaryRedButton,
} from '../components/core/Button';
import Loading from '../components/core/Loading';
import PlayerCard from '../components/card/PlayerCard';
import HostActionCard from '../components/card/HostActionCard';
import { startGame } from '../api/Game';
import {
  getRoom, Room, changeRoomHost, updateRoomSettings, removeUser,
} from '../api/Room';
import { errorHandler } from '../api/Error';
import {
  CopyIndicator,
  CopyIndicatorContainer,
  InlineCopyIcon,
  InlineBackgroundCopyText,
} from '../components/special/CopyIndicator';
import IdContainer from '../components/special/IdContainer';
import { FlexBareContainer } from '../components/core/Container';
import { Slider, SliderContainer } from '../components/core/RangeSlider';

type LobbyPageLocation = {
  user: User,
  roomId: string,
};

const HeaderContainer = styled.div`
  text-align: left;
  width: 66%;
  margin: 2rem auto 0;

  @media (max-width: 750px) {
    width: 80%;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const PrimaryButtonZeroLeftMargin = styled(PrimaryButton)`
  margin-left: 0;
`;

const FlexBareContainerLeft = styled(FlexBareContainer)`
  text-align: left;
`;

const PlayersContainer = styled.div`
  flex: 6;
  padding-right: 5px;
`;

const RoomSettingsContainer = styled.div`
  flex: 4;
  padding-left: 5px;
`;

const SmallHeaderTextZeroTopMargin = styled(SmallHeaderText)`
  margin: 0 0 10px 0;
`;

const BackgroundContainer = styled.div`
  height: 12rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  border-radius: 0.75rem;
  overflow: auto;
`;

const DifficultyContainer = styled.div`
  margin-bottom: 10px;
`;

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

  // Variable to hold whether the room link was copied.
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);

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
          me={currentUser !== null && (user.nickname === currentUser.nickname)}
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

    setLoading(true);
    connect(roomId, userId).then(() => {
      // Body encrypt through JSON.
      subscribe(routes(roomId).subscribe_lobby, subscribeCallback).then((subscriptionParam) => {
        setSubscription(subscriptionParam);
        setSocketConnected(true);
        setError('');
        setLoading(false);
      }).catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [currentUser, conditionallyBootKickedUser]);

  const refreshRoomDetails = () => {
    // Call GET endpoint to get latest room info
    if (!loading) {
      setLoading(true);
      getRoom(location.state.roomId)
        .then((res) => {
          setStateFromRoom(res);

          // Boot the user from the room, if they are not present.
          updateCurrentUserDetails(res.users);

          // Attempt to connect the user to the socket.
          if (currentUser && currentUser.userId) {
            connectUserToRoom(res.roomId, currentUser.userId);
          }
        })
        .catch((err) => setError(err));
    }
  };

  const leaveRoom = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to leave the room?')) {
      if (currentUser && currentUser.userId) {
        setLoading(true);
        setError('');
        removeUser(currentRoomId, {
          initiator: currentUser,
          userToDelete: currentUser,
        });
        disconnect();
      }

      // Redirect user regardless of POST request success.
      history.replace('/game/join', {
        error: errorHandler('You left the room.'),
      });
    }
  };

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
      // eslint-disable-next-line no-unused-expressions
      subscription?.unsubscribe();
      history.replace('/game', {
        roomId: currentRoomId,
        currentUser,
        difficulty,
      });
    }
  }, [history, active, currentUser, currentRoomId, difficulty, subscription]);

  // Render the lobby.
  return (
    <>
      <CopyIndicatorContainer copied={copiedRoomLink}>
        <CopyIndicator onClick={() => setCopiedRoomLink(false)}>
          Link copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>
      <HeaderContainer>
        <MainHeaderText>
          Join with the link
          {' '}
          <InlineBackgroundCopyText
            onClick={() => {
              copy(`https://codejoust.co/play?room=${currentRoomId}`);
              setCopiedRoomLink(true);
            }}
          >
            codejoust.co/play?room=
            {currentRoomId}
            <InlineCopyIcon>content_copy</InlineCopyIcon>
          </InlineBackgroundCopyText>
          {' '}
          or at
          {' '}
          <i>codejoust.co/play</i>
          {' '}
          with Room ID:
        </MainHeaderText>
        <IdContainer id={currentRoomId} />
        <PrimaryButtonZeroLeftMargin
          onClick={handleStartGame}
          disabled={loading || !isHost(currentUser)}
          title={!isHost(currentUser) ? 'Only the host can start the game' : undefined}
        >
          Start Game
        </PrimaryButtonZeroLeftMargin>
        <SecondaryRedButton
          onClick={leaveRoom}
        >
          Leave Room
        </SecondaryRedButton>
      </HeaderContainer>

      <FlexBareContainerLeft>
        <PlayersContainer>
          <SmallHeaderTextZeroTopMargin>
            Players
            {
              (activeUsers && inactiveUsers)
                ? ` (${activeUsers.length + inactiveUsers.length})`
                : null
            }
            <InlineRefreshIcon
              onClick={refreshRoomDetails}
            >
              refresh
            </InlineRefreshIcon>
          </SmallHeaderTextZeroTopMargin>
          <BackgroundContainer>
            {
              displayUsers(activeUsers, true)
            }
            {
              displayUsers(inactiveUsers, false)
            }
            { error ? <ErrorMessage message={error} /> : null }
            { loading ? <Loading /> : null }
          </BackgroundContainer>
        </PlayersContainer>
        <RoomSettingsContainer>
          <SmallHeaderTextZeroTopMargin>Room Settings</SmallHeaderTextZeroTopMargin>
          <BackgroundContainer>
            <NoMarginMediumText>Difficulty</NoMarginMediumText>
            <DifficultyContainer>
              {Object.keys(Difficulty).map((key) => {
                const difficultyKey: Difficulty = Difficulty[key as keyof typeof Difficulty];
                return (
                  <SmallDifficultyButton
                    difficulty={difficultyKey}
                    onClick={() => updateDifficultySetting(key)}
                    active={difficulty === difficultyKey}
                    enabled={isHost(currentUser)}
                    disabled={!isHost(currentUser)}
                    title={!isHost(currentUser) ? 'Only the host can change these settings' : undefined}
                  >
                    {key}
                  </SmallDifficultyButton>
                );
              })}
            </DifficultyContainer>
            <NoMarginMediumText>Duration</NoMarginMediumText>
            <NoMarginSubtitleText>
              {`${duration} minutes`}
            </NoMarginSubtitleText>
            <SliderContainer>
              <Slider
                min={1}
                max={60}
                value={duration}
                disabled={!isHost(currentUser)}
                title={!isHost(currentUser) ? 'Only the host can change these settings' : undefined}
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
                onMouseUp={updateRoomDuration}
              />
            </SliderContainer>
          </BackgroundContainer>
        </RoomSettingsContainer>
      </FlexBareContainerLeft>
    </>
  );
}

export default LobbyPage;
