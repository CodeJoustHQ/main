import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';

function JoinGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  /**
   * Page state variable that defines whether the user is
   * entering a room ID or a nickname.
   * 1 = Enter Room ID
   * 2 = Enter Nickname
   */
  const [pageState, setPageState] = useState(1);

  /**
   * Redirect the user to the lobby.
   */
  const redirectToLobby = (nickname: string) => new Promise<undefined>((resolve) => {
    history.push('/game/lobby', { nickname });
    resolve();
  });

  let joinPageContent: ReactElement | undefined;

  switch(pageState) {
    case 1:
      // Render the "Enter room ID" state.
      joinPageContent = (
        <LargeText>
          {enterNicknameHeaderText}
        </LargeText>
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
              enterNicknameActionUpdatePage(nickname);
            }
          }}
        />
        <LargeInputButton
          onClick={() => {
            enterNicknameActionUpdatePage(nickname);
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
        { loading ? <Loading /> : null }
        { error ? <ErrorMessage message={error} /> : null }
      );
    case 2: 
      // Render the "Enter nickname" state.
      joinPageContent = (
        <EnterNicknamePage
          enterNicknameHeaderText="Enter a nickname to join the game!"
          // Partial application of addUserToLobby function.
          enterNicknameAction={redirectToLobby}
        />
      );
    default: setPageState(1);
  }
  

  return joinPageContent;
}

export default JoinGamePage;
