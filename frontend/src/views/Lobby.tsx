import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Message, Subscription } from 'stompjs';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import ErrorMessage from '../components/core/Error';
import {
  NoMarginMediumText,
  SecondaryHeaderText,
  SmallHeaderText,
  NoMarginSubtitleText,
} from '../components/core/Text';
import {
  connect, routes, subscribe, disconnect,
} from '../api/Socket';
import { User } from '../api/User';
import { isValidRoomId, leaveRoom } from '../util/Utility';
import { Difficulty } from '../api/Difficulty';
import {
  PrimaryButton,
  SmallDifficultyButtonNoMargin,
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
import { Coordinate } from '../components/special/FloatingCircle';
import { HoverContainer, HoverElement, HoverTooltip } from '../components/core/HoverTooltip';
import { SelectableProblem } from '../api/Problem';
import ProblemSelector from '../components/problem/ProblemSelector';
import SelectedProblemsDisplay from '../components/problem/SelectedProblemsDisplay';
import { useAppDispatch, useAppSelector } from '../util/Hook';
import { setRoom } from '../redux/Room';
import { setCurrentUser } from '../redux/User';

type LobbyPageLocation = {
  user: User,
  roomId: string,
};

const HeaderContainer = styled.div`
  max-width: 500px;
  text-align: left;
  width: 66%;
  margin: 2rem auto 1rem auto;

  @media (max-width: 750px) {
    width: 80%;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const PrimaryButtonNoMargin = styled(PrimaryButton)`
  margin: 0;
`;

const FlexBareContainerLeft = styled(FlexBareContainer)`
  text-align: left;
`;

const PlayersContainer = styled.div`
  flex: 1;
  padding-right: 5px;
`;

const RoomSettingsContainer = styled.div`
  flex: 1;
  padding-left: 5px;
`;

const LobbyContainerTitle = styled(SmallHeaderText)`
  margin: 0 0 10px 0;
`;

const BackgroundContainer = styled.div`
  height: 16rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  border-radius: 0.75rem;
  overflow: auto;
`;

const DifficultyContainer = styled.div`
  margin-bottom: 10px;
`;

const HoverContainerPrimaryButton = styled(HoverContainer)`
  margin: 1.2rem 1.2rem 1.2rem 0;
`;

const HoverElementPrimaryButton = styled(HoverElement)`
  width: 12rem;
  height: 3rem;
`;

const HoverContainerSmallDifficultyButton = styled(HoverContainer)`
  margin: 0.5rem 1rem 0 0;
`;

const HoverElementSmallDifficultyButton = styled(HoverElement)`
  width: 5rem;
  height: 2rem;
`;

const HoverContainerSlider = styled(HoverContainer)`
  width: 100%;
  margin: 0.5rem 0;
`;

const HoverElementSlider = styled(HoverElement)`
  max-width: 370px;
  width: 100%;
  height: 20px;
`;

function LobbyPage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LobbyPageLocation>();

  // Set the current user
  // const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Set all the different variables in the room object
  const [host, setHost] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[] | null>(null);
  const [inactiveUsers, setInactiveUsers] = useState<User[] | null>(null);
  const [currentRoomId, setRoomId] = useState('');
  const [active, setActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [duration, setDuration] = useState<number | undefined>(15);
  const [selectedProblems, setSelectedProblems] = useState<SelectableProblem[]>([]);
  const [size, setSize] = useState<number | undefined>(10);
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);

  // React Redux
  const dispatch = useAppDispatch();
  const { room } = useAppSelector((state) => state);
  const { currentUser } = useAppSelector((state) => state);

  // Hold error text.
  const [error, setError] = useState('');

  // Hold loading boolean.
  const [loading, setLoading] = useState(false);

  // Variable to hold the socket subscription, or null if not connected
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Variable to hold whether the room link was copied.
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);

  /**
   * Set state variables from an updated room object
   */
  const setStateFromRoom = (room: Room) => {
    setHost(room.host);
    setUsers(room.users);
    setActiveUsers(room.activeUsers);
    setInactiveUsers(room.inactiveUsers);
    setRoomId(room.roomId);
    setActive(room.active);
    setDifficulty(room.difficulty);
    setDuration(room.duration / 60);
    setSelectedProblems(room.problems);
    setSize(room.size);
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
  useEffect(() => {
    if (room?.users) {
      let userIncluded: boolean = false;
      room!.users.forEach((user) => {
        if (currentUser!.userId === user.userId) {
          userIncluded = true;
        }
      });

      // If user is no longer present in room, boot the user.
      if (!userIncluded) {
        disconnect().then(() => {
          dispatch(setCurrentUser(null));
          history.replace('/game/join', {
            error: errorHandler('You have been kicked from the room.'),
          });
        });
      }
    }
  }, [currentUser, room?.users, history]);

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
   * Update the list of selected problems
   */
  const updateSelectedProblems = (newProblems: SelectableProblem[]) => {
    setError('');
    setLoading(true);

    const prevProblems = selectedProblems;
    setSelectedProblems(newProblems);

    const settings = {
      initiator: currentUser!,
      problems: newProblems,
    };

    updateRoomSettings(currentRoomId, settings)
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        setSelectedProblems(prevProblems);
      });
  };

  const addProblem = (newProblem: SelectableProblem) => {
    const newProblems = [...selectedProblems, newProblem];
    updateSelectedProblems(newProblems);
  };

  const removeProblem = (index: number) => {
    const newProblems = selectedProblems.filter((_, i) => i !== index);
    updateSelectedProblems(newProblems);
  };

  const onSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Set size to undefined to allow users to clear field
    if (!value) {
      setSize(undefined);
    } else {
      const newSize = Number(value);

      if (newSize >= (users?.length || 0) && newSize <= 31) {
        if (newSize !== size) {
          setError('');
        }

        setSize(newSize);
      } else if (newSize < (users?.length || 0)) {
        setSize((users?.length || 0));
        setError('The room limit cannot be set below the number of connected players.');
      }
    }
  };

  const onDurationSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      setDuration(undefined);
    } else {
      const newDuration = Number(value);
      if (newDuration >= 0 && newDuration <= 60) {
        setDuration(newDuration);
      }
    }
  };

  const updateSize = () => {
    setLoading(true);
    const prevSize = size;
    const settings = {
      initiator: currentUser!,
      size,
    };

    updateRoomSettings(currentRoomId, settings)
      .then(() => setLoading(false))
      .then(() => setError(''))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        // Set size back to original if REST call failed
        setSize(prevSize);
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
          key={user.userId}
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
    // Callback to update the Redux state to hold the latest Room info
    const subscribeCallback = (result: Message) => {
      const newRoom: Room = JSON.parse(result.body);
      setStateFromRoom(newRoom);
      dispatch(setRoom(newRoom));
    };

    setLoading(true);
    connect(roomId, userId).then(() => {
      // Body encrypt through JSON.
      subscribe(routes(roomId).subscribe_lobby, subscribeCallback).then((subscriptionParam) => {
        setSubscription(subscriptionParam);
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
  }, []);

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
        .catch((err) => setError(err.message));
    }
  };

  // Get current mouse position.
  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.pageX, y: e.pageY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Redirect to the join page if room and currentUser not set
    if (!room || !currentUser || !currentUser.userId) {
      // Get URL query params to determine if the roomId is provided.
      const urlParams = new URLSearchParams(window.location.search);
      const roomIdQueryParam: string | null = urlParams.get('room');
      if (roomIdQueryParam && isValidRoomId(roomIdQueryParam)) {
        setRoomId(roomIdQueryParam);
        history.replace(`/game/join?room=${roomIdQueryParam}`);
      } else {
        history.replace('/game/join');
      }
      return;
    }

    // If this is the first time loading, connect to the socket
    if (!subscription) {
      setStateFromRoom(room);
      connectUserToRoom(room!.roomId, currentUser!.userId!);
    }
  }, [room, currentUser, subscription, history, connectUserToRoom]);

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

  const hoverProps = {
    enabled: isHost(currentUser),
    onMouseEnter: () => {
      if (!isHost(currentUser)) {
        setHoverVisible(true);
      }
    },
    onMouseLeave: () => {
      if (!isHost(currentUser)) {
        setHoverVisible(false);
      }
    },
  };

  // Render the lobby.
  return (
    <>
      <HoverTooltip
        visible={hoverVisible}
        x={mousePosition.x}
        y={mousePosition.y}
      >
        Only the host can start the game and update settings
      </HoverTooltip>
      <CopyIndicatorContainer copied={copiedRoomLink}>
        <CopyIndicator onClick={() => setCopiedRoomLink(false)}>
          Link copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>
      <HeaderContainer>
        <SecondaryHeaderText>
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
        </SecondaryHeaderText>
        <IdContainer id={currentRoomId} />
        <HoverContainerPrimaryButton>
          <HoverElementPrimaryButton {...hoverProps} />
          <PrimaryButtonNoMargin
            onClick={handleStartGame}
            disabled={loading || !isHost(currentUser)}
          >
            Start Game
          </PrimaryButtonNoMargin>
        </HoverContainerPrimaryButton>

        <SecondaryRedButton
          onClick={() => leaveRoom(history, currentRoomId, currentUser)}
        >
          Leave Room
        </SecondaryRedButton>

      </HeaderContainer>

      <FlexBareContainerLeft>
        <PlayersContainer>
          <LobbyContainerTitle>
            Players
            {
              users
                ? ` (${users.length})`
                : null
            }
            <InlineRefreshIcon
              onClick={refreshRoomDetails}
            >
              refresh
            </InlineRefreshIcon>
          </LobbyContainerTitle>
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
          <LobbyContainerTitle>Room Settings</LobbyContainerTitle>
          <BackgroundContainer>
            <NoMarginMediumText>Difficulty</NoMarginMediumText>
            <DifficultyContainer>
              {Object.keys(Difficulty).map((key) => {
                const difficultyKey: Difficulty = Difficulty[key as keyof typeof Difficulty];
                return (
                  <HoverContainerSmallDifficultyButton key={key}>
                    <HoverElementSmallDifficultyButton {...hoverProps} />
                    <SmallDifficultyButtonNoMargin
                      difficulty={difficultyKey}
                      onClick={() => updateDifficultySetting(key)}
                      active={difficulty === difficultyKey}
                      enabled={isHost(currentUser)}
                      disabled={!isHost(currentUser)}
                    >
                      {key}
                    </SmallDifficultyButtonNoMargin>
                  </HoverContainerSmallDifficultyButton>
                );
              })}
            </DifficultyContainer>

            <NoMarginMediumText>Selected Problems</NoMarginMediumText>
            <SelectedProblemsDisplay
              problems={selectedProblems}
              onRemove={isHost(currentUser) ? removeProblem : null}
            />
            {isHost(currentUser) ? (
              <ProblemSelector
                selectedProblems={selectedProblems}
                onSelect={addProblem}
              />
            ) : null}

            <NoMarginMediumText>Duration</NoMarginMediumText>
            <NoMarginSubtitleText>
              {`${duration} minute${duration === 1 ? '' : 's'}`}
            </NoMarginSubtitleText>
            <HoverContainerSlider>
              <HoverElementSlider {...hoverProps} />
              <SliderContainer>
                <Slider
                  min={1}
                  max={60}
                  value={duration}
                  disabled={!isHost(currentUser)}
                  onChange={onDurationSliderChange}
                  onMouseUp={updateRoomDuration}
                />
              </SliderContainer>
            </HoverContainerSlider>
            <NoMarginMediumText>Room Size</NoMarginMediumText>
            <NoMarginSubtitleText>
              {size === 31 ? 'No limit' : `${size === 1 ? '1 person' : `${size} people`}`}
            </NoMarginSubtitleText>
            <HoverContainerSlider>
              <HoverElementSlider
                enabled={isHost(currentUser)}
                onMouseEnter={() => {
                  if (!isHost(currentUser)) {
                    setHoverVisible(true);
                  }
                }}
                onMouseLeave={() => {
                  if (!isHost(currentUser)) {
                    setHoverVisible(false);
                  }
                }}
              />
              <SliderContainer>
                <Slider
                  min={1}
                  max={31}
                  value={size}
                  disabled={!isHost(currentUser)}
                  onChange={onSizeSliderChange}
                  onMouseUp={updateSize}
                />
              </SliderContainer>
            </HoverContainerSlider>
          </BackgroundContainer>
        </RoomSettingsContainer>
      </FlexBareContainerLeft>
    </>
  );
}

export default LobbyPage;
