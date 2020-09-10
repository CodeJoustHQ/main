import React, { useState, ReactElement } from 'react';
import { LargeText, Text } from '../components/core/Text';
import { LargeCenterInputText, LargeInputButton } from '../components/core/Input';
import {
  connect, disconnect, sendUser, SOCKET_ENDPOINT,
} from '../api/Socket';

function JoinGamePage() {
  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

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
          <LargeCenterInputText placeholder="Your nickname" onChange={(event: any) => setNickname(event.target.value)} />
          <LargeInputButton
            onClick={() => {
              connect(SOCKET_ENDPOINT, nickname);
              setPageState(1);
            }}
            value="Enter"
          />
        </div>
      );
      break;
    case 2:
      // Render the Waiting room state.
      joinPageContent = (
        <div>
          <Text>
            You have entered the waiting room! Your nickname is &quot;
            {nickname}
            &quot;.
          </Text>
        </div>
      );
      break;
    default:
  }

  return joinPageContent;
}

export default JoinGamePage;
