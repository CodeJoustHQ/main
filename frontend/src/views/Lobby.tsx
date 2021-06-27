import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { Message, Subscription } from 'stompjs';
import { useBeforeunload } from 'react-beforeunload';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import ErrorMessage from '../components/core/Error';
import {
  NoMarginMediumText,
  SecondaryHeaderText,
  SmallHeaderText,
  NoMarginSubtitleText,
  LowMarginText,
  Text,
} from '../components/core/Text';
import {
  connect, routes, subscribe, disconnect,
} from '../api/Socket';
import { User } from '../api/User';
import { isValidRoomId, leaveRoom, checkLocationState } from '../util/Utility';
import { Difficulty } from '../api/Difficulty';
import {
  PrimaryButton,
  SmallDifficultyButtonNoMargin,
  SecondaryRedButton,
  TextButton,
} from '../components/core/Button';
import { InlineIcon } from '../components/core/Icon';
import Loading from '../components/core/Loading';
import PlayerCard from '../components/card/PlayerCard';
import ActionCard from '../components/card/ActionCard';
import { startGame } from '../api/Game';
import {
  Room,
  changeRoomHost,
  updateRoomSettings,
  removeUser,
  setSpectator,
} from '../api/Room';
import { errorHandler } from '../api/Error';
import {
  CopyIndicator,
  CopyIndicatorContainer,
  InlineCopyIcon,
  InlineBackgroundCopyText,
} from '../components/special/CopyIndicator';
import IdContainer from '../components/special/IdContainer';
import { FlexBareContainer, LeftContainer } from '../components/core/Container';
import { Slider, SliderContainer } from '../components/core/RangeSlider';
import { HoverContainer, HoverElement, HoverTooltip } from '../components/core/HoverTooltip';
import { SelectableProblem } from '../api/Problem';
import { ProblemSelector } from '../components/problem/Selector';
import { SelectedProblemsDisplay } from '../components/problem/SelectedDisplay';
import { useAppDispatch, useAppSelector, useMousePosition } from '../util/Hook';
import { fetchRoom, setRoom } from '../redux/Room';
import { setCurrentUser } from '../redux/User';
import { LobbyHelpModal } from '../components/core/HelpModal';
import Modal from '../components/core/Modal';
import { setGame } from '../redux/Game';

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

const ShowProblemSelectorContainer = styled.div`
  margin: 10px 0;
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

const ExitModalButton = styled(PrimaryButton)`
  margin: 20px 0;
`;

function LobbyPage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LobbyPageLocation>();

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
  const [numProblems, setNumProblems] = useState<number>(1);
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);
  const [showProblemSelector, setShowProblemSelector] = useState(true);

  // React Redux
  const dispatch = useAppDispatch();
  const { room } = useAppSelector((state) => state);
  const { currentUser } = useAppSelector((state) => state);

  const mousePosition = useMousePosition(true);

  // Hold error text.
  const [error, setError] = useState('');

  // Hold loading boolean.
  const [loading, setLoading] = useState(false);

  // Variable to hold the socket subscription, or null if not connected
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Variable to hold whether the room link was copied.
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);

  // Variable to hold whether the modal explaining the user cards is active.
  const [actionCardHelp, setActionCardHelp] = useState<boolean>(false);

  // Function to determine if the given user is the host or not
  const isHost = useCallback((user: User | null) => user?.userId === host?.userId, [host]);

  useBeforeunload(() => (isHost(currentUser)
    ? 'Leave this page? If you leave, host permissions may be transferred to another user.'
    : 'Leave this page? You can always rejoin later.'));

  // If playing again, clear any old game state
  useEffect(() => {
    dispatch(setGame(null));
  }, [dispatch]);

  /**
   * Set state variables from an updated room object
   */
  const setStateFromRoom = useCallback((newRoom: Room) => {
    setHost(newRoom.host);
    setUsers(newRoom.users);
    setActiveUsers(newRoom.activeUsers);
    setInactiveUsers(newRoom.inactiveUsers);
    setRoomId(newRoom.roomId);
    setActive(newRoom.active);
    setDifficulty(newRoom.difficulty);
    setDuration(newRoom.duration / 60);
    setSelectedProblems(newRoom.problems);
    setSize(newRoom.size);
    setNumProblems(newRoom.numProblems);

    // Set the room and current user.
    dispatch(setRoom(newRoom));
    newRoom.users.forEach((user) => {
      if (user.userId === currentUser?.userId) {
        dispatch(setCurrentUser(user));
      }
    });
  }, [currentUser, dispatch]);

  // Map the room in Redux to the state variables used in this file
  useEffect(() => {
    if (room) {
      setStateFromRoom(room);
    }
  }, [room, setStateFromRoom]);

  const kickUser = (user: User) => {
    setLoading(true);
    setError('');
    removeUser(currentRoomId, {
      initiator: currentUser as User,
      userToDelete: user,
    })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * If the user is not present in the room after a refresh, then
   * disconnect them and boot them off the page, as they were kicked.
   */
  const conditionallyBootKickedUser = useCallback((roomParam: Room, userId) => {
    let userIncluded: boolean = false;
    roomParam.users.forEach((user) => {
      if (userId === user.userId) {
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
  }, [history, dispatch]);

  useEffect(() => {
    if (room && currentUser?.userId) {
      conditionallyBootKickedUser(room, currentUser?.userId);
    }
  }, [room, currentUser, conditionallyBootKickedUser]);

  const changeHosts = (newHost: User) => {
    setError('');
    const request = {
      initiator: currentUser!,
      newHost,
    };

    if (!loading) {
      setLoading(true);
      changeRoomHost(currentRoomId, request)
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Update the spectator status of the user in question.
  const updateSpectator = (updatedSpectatorUser: User) => {
    setError('');
    const request = {
      initiator: currentUser!,
      receiver: updatedSpectatorUser,
      spectator: !updatedSpectatorUser.spectator,
    };

    if (!loading) {
      setLoading(true);
      setSpectator(currentRoomId, request)
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleStartGame = () => {
    setError('');
    const request = { initiator: currentUser as User };

    // Determine if the room only has spectators.
    let allSpectators: boolean = true;
    room!.users.forEach((user: User) => {
      if (!user.spectator) {
        allSpectators = false;
      }
    });

    // eslint-disable-next-line no-alert
    if (!allSpectators || window.confirm('Everybody in this room is a spectator, which means this is '
      + 'going to be a pretty boring game... are you sure you want to start the game?')) {
      startGame(currentRoomId, request)
        .then(() => {
          setLoading(true);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
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
        .catch((err) => {
          setError(err.message);
          // Set difficulty back to original if REST call failed
          setDifficulty(oldDifficulty);
        })
        .finally(() => {
          setLoading(false);
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
      .catch((err) => {
        setError(err.message);
        // Set duration back to original if REST call failed
        setDuration(prevDuration);
      })
      .finally(() => {
        setLoading(false);
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
      problems: newProblems.map((problem) => ({ problemId: problem.problemId })),
    };

    updateRoomSettings(currentRoomId, settings)
      .catch((err) => {
        setError(err.message);
        setSelectedProblems(prevProblems);
      })
      .finally(() => {
        setLoading(false);
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
      .then(() => setError(''))
      .catch((err) => {
        setError(err.message);
        // Set size back to original if REST call failed
        setSize(prevSize);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateNumProblems = () => {
    setError('');
    setLoading(true);
    const prevNumProblems = numProblems;
    const settings = {
      initiator: currentUser!,
      numProblems,
    };

    updateRoomSettings(currentRoomId, settings)
      .catch((err) => {
        setError(err.message);
        // Set numProblems back to original if REST call failed
        setNumProblems(prevNumProblems);
      }).finally(() => {
        setLoading(false);
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
          <ActionCard
            user={user}
            userIsHost={isHost(user)}
            currentUserIsHost={isHost(currentUser)}
            isCurrentUser={user.userId === currentUser?.userId}
            userIsActive={Boolean(user.sessionId)}
            onUpdateSpectator={updateSpectator}
            onMakeHost={changeHosts}
            onRemoveUser={kickUser}
          />
        </PlayerCard>
      ));
    }
    return null;
  };

  const refreshRoomDetails = () => {
    // Call GET endpoint to get latest room info
    if (!loading) {
      setLoading(true);
      setError('');
      dispatch(fetchRoom(location.state.roomId))
        .then(unwrapResult)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  /**
   * Connect the user to the socket and subscribe to room updates.
   * This method uses useCallback so it is not re-built in
   * the useEffect function.
   */
  const connectUserToRoom = useCallback((roomId: string, userId: string) => {
    // Callback to update the Redux state to hold the latest Room info
    const subscribeCallback = (result: Message) => {
      const newRoom: Room = JSON.parse(result.body);
      dispatch(setRoom(newRoom));
    };

    setLoading(true);
    connect(userId).then(() => {
      // Body encrypt through JSON.
      subscribe(routes(roomId).subscribe_lobby, subscribeCallback).then((subscriptionParam) => {
        setSubscription(subscriptionParam);
        dispatch(fetchRoom(roomId))
          .then(unwrapResult)
          .then(() => setError(''))
          .catch((err) => setError(err.message));
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    }).finally(() => setLoading(false));
  }, [dispatch]);

  // Grab the nickname variable and add the user to the lobby.
  useEffect(() => {
    // Grab the user and room information; otherwise, redirect to the join page
    if (checkLocationState(location, 'user', 'roomId')) {
      // Set room if it doesn't exist in Redux state
      if (!room || room?.roomId !== location.state.roomId) {
        dispatch(fetchRoom(location.state.roomId))
          .then(unwrapResult)
          .catch((err) => setError(err.message));
      }
      if (!currentUser) {
        dispatch(setCurrentUser(location.state.user));
      }
    } else {
      // Get URL query params to determine if the roomId is provided.
      const urlParams = new URLSearchParams(window.location.search);
      const roomIdQueryParam: string | null = urlParams.get('room');
      if (roomIdQueryParam && isValidRoomId(roomIdQueryParam)) {
        history.replace(`/game/join?room=${roomIdQueryParam}`);
      } else {
        history.replace('/game/join');
      }
    }
  }, [room, currentUser, subscription, location, history, dispatch]);

  useEffect(() => {
    // Connect to socket if not already
    if (!subscription && currentRoomId && currentUser?.userId) {
      connectUserToRoom(currentRoomId, currentUser!.userId!);
    }
  }, [subscription, currentRoomId, currentUser, connectUserToRoom]);

  // Redirect user to game page if room is active.
  useEffect(() => {
    if (active) {
      // eslint-disable-next-line no-unused-expressions
      subscription?.unsubscribe();
      history.replace('/game', {
        roomId: currentRoomId,
        currentUser,
      });
    }
  }, [history, active, currentUser, currentRoomId, subscription]);

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
      <LobbyHelpModal
        show={actionCardHelp}
        exitModal={() => setActionCardHelp(false)}
      />
      <Modal
        show={showProblemSelector && isHost(currentUser)}
        onExit={() => setShowProblemSelector(false)}
        fullScreen
      >
        <LeftContainer>
          <NoMarginMediumText>Select problems for this game:</NoMarginMediumText>
          <Text>
            Use the dropdown below to select the problems for your game.
            Alternatively, skip this step to create a game with a random problem.
          </Text>
          { error ? <ErrorMessage message={error} /> : null }
          <ProblemSelector
            selectedProblems={selectedProblems}
            onSelect={addProblem}
          />
          <SelectedProblemsDisplay
            problems={selectedProblems}
            onRemove={isHost(currentUser) ? removeProblem : null}
          />
          <ExitModalButton
            onClick={() => setShowProblemSelector(false)}
          >
            All Good!
          </ExitModalButton>
        </LeftContainer>
      </Modal>
      <HoverTooltip
        visible={hoverVisible && !isHost(currentUser)}
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
          onClick={() => leaveRoom(dispatch, history, currentRoomId, currentUser)}
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
            <InlineIcon
              onClick={refreshRoomDetails}
            >
              refresh
            </InlineIcon>
            <InlineIcon
              onClick={() => setActionCardHelp(true)}
            >
              help_outline
            </InlineIcon>
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
            {!selectedProblems.length ? (
              <>
                <NoMarginMediumText>Difficulty</NoMarginMediumText>
                {isHost(currentUser) ? (
                  <LowMarginText>
                    Choose a difficulty for your randomly selected problem:
                  </LowMarginText>
                ) : null}
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
              </>
            ) : (
              <>
                <NoMarginMediumText>Problems</NoMarginMediumText>
                <SelectedProblemsDisplay
                  problems={selectedProblems}
                  onRemove={isHost(currentUser) ? removeProblem : null}
                />
              </>
            )}

            {isHost(currentUser) ? (
              <ShowProblemSelectorContainer>
                <TextButton onClick={() => setShowProblemSelector(true)}>
                  {selectedProblems.length ? 'Edit problem selection ' : 'Or choose a specific problem '}
                  &#8594;
                </TextButton>
              </ShowProblemSelectorContainer>
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
              <HoverElementSlider {...hoverProps} />
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
            <NoMarginMediumText>Number of Problems</NoMarginMediumText>
            <NoMarginSubtitleText>
              {`${numProblems} problem${numProblems === 1 ? '' : 's'}`}
            </NoMarginSubtitleText>
            <HoverContainerSlider>
              <HoverElementSlider {...hoverProps} />
              <SliderContainer>
                <Slider
                  min={1}
                  max={10}
                  value={numProblems}
                  disabled={!isHost(currentUser)}
                  onChange={(e) => {
                    const newNumProblems = Number(e.target.value);
                    if (newNumProblems >= 1 && newNumProblems <= 10) {
                      setNumProblems(newNumProblems);
                    }
                  }}
                  onMouseUp={updateNumProblems}
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
