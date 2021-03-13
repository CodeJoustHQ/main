import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';
import { LargeCenterInputText, PrimaryInput } from '../components/core/Input';
import { LargeText, Text } from '../components/core/Text';
import { User } from '../api/User';
import { joinRoom, getRoom } from '../api/Room';
import Loading from '../components/core/Loading';
import ErrorMessage from '../components/core/Error';
import { ErrorResponse } from '../api/Error';
import { checkLocationState, isValidRoomId } from '../util/Utility';

type JoinPageLocation = {
  error: ErrorResponse,
};

function JoinGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<JoinPageLocation>();

  /**
   * Page state variable that defines whether the user is
   * entering a room ID or a nickname.
   * 1 = Enter Room ID (default)
   * 2 = Enter Nickname
   */
  const [pageState, setPageState] = useState(1);

  // Variable to hold the user's current room ID input (default empty string).
  const [roomId, setRoomId] = useState('');

  // Hold loading boolean, triggered upon entering nickname.
  const [loading, setLoading] = useState(false);

  // Set error if one exists
  const [error, setError] = useState('');

  // If redirected with an error, display that error
  useEffect(() => {
    if (checkLocationState(location, 'error')) {
      setError(location.state.error.message);
      // Clear error to prevent re-displaying on refresh
      history.replace('/game/join', null);
    }
  }, [location, history]);

  /**
   * The roomId is valid if it is non-empty and has exactly
   * six numeric characters.
   */
  const [validRoomId, setValidRoomId] = useState(false);
  useEffect(() => {
    setValidRoomId(isValidRoomId(roomId));
  }, [roomId]);

  // Variable to hold whether the user is focused on the text input field.
  const [focusInput, setFocusInput] = useState(false);

  /**
   * Check if a room exists with the current roomId.
   */
  const checkRoom = (roomIdParam: string) => {
    // Only verify if previous REST call is not still running
    if (!loading) {
      setLoading(true);
      getRoom(roomIdParam)
        .then((res) => {
          setLoading(false);
          if (res.active) {
            setError('Cannot join a game that has already started.');
          } else {
            setPageState(2);
          }
        }).catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }
  };

  /**
   * Join the room and redirect the user to the lobby.
   */
  const redirectToLobby = (nickname: string) => new Promise<undefined>((_, reject) => {
    const user: User = { nickname };
    const roomParams = { user };

    joinRoom(roomId, roomParams)
      .then(() => {
        history.push(`/game/lobby?room=${roomId}`, { user, roomId });
      }).catch((err) => reject(err));
  });

  /**
   * Get URL query params to determine if the roomId is provided.
   * Only run on initial page load.
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdQueryParam = urlParams.get('room') || '';
    if (roomIdQueryParam && isValidRoomId(roomIdQueryParam)) {
      setRoomId(roomIdQueryParam);
    }
  }, [setRoomId]);

  let joinPageContent: ReactElement | undefined;

  switch (pageState) {
    case 1:
      // Render the "Enter room ID" state.
      joinPageContent = (
        <div>
          <LargeText>
            Enter the six-digit room ID to join the game!
          </LargeText>
          <LargeCenterInputText
            id="roomIdInput"
            placeholder="123456"
            width="16rem"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setError('');
              setRoomId(event.target.value);
            }}
            value={roomId}
            onFocus={() => {
              setFocusInput(true);
            }}
            onBlur={() => {
              setFocusInput(false);
            }}
            onKeyPress={(event) => {
              setError('');
              /**
               * If the key pressed is not a number or the roomId is
               * already at length 6, do not add it to the input.
               */
              if (event.key < '0' || event.key > '9' || roomId.length >= 6) {
                event.preventDefault();
              }
              if (event.key === 'Enter' && validRoomId && !loading) {
                checkRoom(roomId);
              }
            }}
          />
          <PrimaryInput
            onClick={() => {
              checkRoom(roomId);
            }}
            value="Enter"
            // Input is disabled if loading or if no nickname exists, has a space, or is too long.
            disabled={!validRoomId || loading}
          />
          { focusInput && !validRoomId ? (
            <Text>
              The room ID must have exactly six digits (numbers 0 through 9).
            </Text>
          ) : null}
          { loading ? <Loading /> : null }
          { error ? <ErrorMessage message={error} /> : null }
        </div>
      );
      break;
    case 2:
      // Render the "Enter nickname" state.
      joinPageContent = (
        <div>
          <EnterNicknamePage
            enterNicknameHeaderText={`Enter a nickname to join room #${roomId}!`}
            enterNicknameAction={redirectToLobby}
          />
        </div>
      );
      break;
    default:
  }

  return joinPageContent;
}

export default JoinGamePage;
