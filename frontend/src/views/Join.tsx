import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';
import ErrorMessage from '../components/core/Error';
import { LargeCenterInputText, LargeInputButton } from '../components/core/Input';
import { LargeText, Text } from '../components/core/Text';

type JoinPageLocation = {
  pageState: number,
  roomId?: string;
}

function JoinGamePage() {
  // Get history object to be able to move between different pages
  const location = useLocation<JoinPageLocation>();

  // Function to update the location variable upon entered room ID.
  const updateLocation = (roomIdParam: string) => {
    location.state = {
      pageState: 2,
      roomId: roomIdParam,
    };
  };

  // Get history object to be able to move between different pages
  const history = useHistory();

  /**
   * Page state variable that defines whether the user is
   * entering a room ID or a nickname.
   * 1 = Enter Room ID
   * 2 = Enter Nickname
   */
  const [pageState, setPageState] = useState(1);

  // Variable to hold the user's current room ID input.
  const [roomId, setRoomId] = useState('');

  /**
   * The nickname is valid if it is non-empty and has exactly
   * six nonalphanumeric characters.
   */
  const isValidRoomId = (roomIdParam: string) => (roomIdParam.length === 6) && /^\d+$/.test(roomIdParam);
  const [validRoomId, setValidRoomId] = useState(false);
  useEffect(() => {
    setValidRoomId(isValidRoomId(roomId));
  }, [roomId]);

  // Variable to hold whether the user is focused on the text input field.
  const [focusInput, setFocusInput] = useState(false);

  /**
   * Redirect the user to the lobby.
   */
  const redirectToLobby = (nickname: string) => new Promise<undefined>((resolve) => {
    history.push('/game/lobby', { nickname });
    resolve();
  });

  useEffect(() => {
    // Set the room ID, if it is saved in location.
    if (location && location.state && location.state.roomId) {
      setRoomId(location.state.roomId);
    }

    // Set the current page state, or initialize it to one by default.
    if (location && location.state && location.state.pageState) {
      setPageState(location.state.pageState);
    } else {
      location.state = {
        pageState: 1,
      };
    }
  }, [location]);

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
            placeholder="123456"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setRoomId(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(true);
            }}
            onBlur={() => {
              setFocusInput(false);
            }}
            onKeyPress={(event) => {
              // If the key pressed is not a number, do not add it to the input.
              if (event.key < '0' || event.key > '9') {
                event.preventDefault();
              }
              if (event.key === 'Enter' && validRoomId) {
                // TODO: Add room ID to location or whatnot.
                setPageState(2);
                updateLocation(roomId);
              }
            }}
          />
          <LargeInputButton
            onClick={() => {
              // TODO: Add room ID to location or whatnot.
              setPageState(2);
            }}
            value="Enter"
            // Input is disabled if no nickname exists, has a space, or is too long.
            disabled={!validRoomId}
          />
          { focusInput && !validRoomId ? (
            <Text>
              The room ID must have exactly six digits (numbers 0 through 9).
            </Text>
          ) : null}
          { /* error ? <ErrorMessage message={error} /> : null */ }
        </div>
      );
      break;
    case 2:
      // Render the "Enter nickname" state.
      joinPageContent = (
        <EnterNicknamePage
          enterNicknameHeaderText="Enter a nickname to join the game!"
          // Partial application of addUserToLobby function.
          enterNicknameAction={redirectToLobby}
        />
      );
      break;
    default: setPageState(1);
  }

  return joinPageContent;
}

export default JoinGamePage;
