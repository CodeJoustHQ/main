import React, { useState, useEffect, ReactElement } from 'react';
import { LargeText, Text } from '../components/core/Text';
import { LargeCenterInputText, LargeInputButton } from '../components/core/Input';
import { connect, SOCKET_ENDPOINT } from '../api/Socket';

function JoinGamePage() {
  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  /**
   * The nickname is valid if it is non-empty, has no spaces, and
   * is <= 16 characters. This is updated whenever the nickname changes.
   */
  const [validNickname, setValidNickname] = useState(false);
  useEffect(() => {
    setValidNickname(nickname.length > 0 && !nickname.includes(' ') && nickname.length <= 16);
  }, [nickname]);

  // Variable to hold whether the user is focused on the text input field.
  const [focusInput, setFocusInput] = useState(false);

  /**
   * Stores the current page state, where:
   * 0 = Enter room ID state (currently unused)
   * 1 = Enter nickname state
   * 2 = Waiting room state
   */
  const [pageState, setPageState] = useState(1);

  // Create variable to hold the "Join Page" content.
  let joinPageContent: ReactElement | undefined;

  switch (pageState) {
    case 1:
      // Render the "Enter nickname" state.
      joinPageContent = (
        <div>
          <LargeText>Enter a nickname to join the game!</LargeText>
          <LargeCenterInputText
            placeholder="Your nickname"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNickname(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(true);
            }}
            onBlur={() => {
              setFocusInput(false);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && validNickname) {
                connect(SOCKET_ENDPOINT, nickname);
                setPageState(2);
              }
            }}
          />
          <LargeInputButton
            onClick={() => {
              connect(SOCKET_ENDPOINT, nickname);
              setPageState(2);
            }}
            value="Enter"
            // Input is disabled if no nickname exists, has a space, or is too long.
            disabled={!validNickname}
          />
          { focusInput && !validNickname ? (
            <Text>
              The nickname must be non-empty, have no spaces, and be less than 16 characters.
            </Text>
          ) : null}
        </div>
      );
      break;
    case 2:
      // Render the Waiting room state.
      joinPageContent = (
        <div>
          <LargeText>
            You have entered the waiting room! Your nickname is &quot;
            {nickname}
            &quot;.
          </LargeText>
        </div>
      );
      break;
    default:
  }

  return joinPageContent;
}

export default JoinGamePage;
