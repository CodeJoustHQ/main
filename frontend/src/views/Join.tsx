import React from 'react';
import { useHistory } from 'react-router-dom';
import EnterNicknamePage from '../components/core/EnterNickname';

function JoinGamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();

  /**
   * Redirect the user to the lobby.
   */
  const redirectToLobby = (nickname: string) => new Promise<undefined>((resolve) => {
    history.push('/game/lobby', { nickname });
    resolve();
  });

  // Render the "Enter nickname" state.
  return (
    <EnterNicknamePage
      enterNicknameHeaderText="Enter a nickname to join the game!"
      // Partial application of addUserToLobby function.
      enterNicknameAction={redirectToLobby}
    />
  );
}

export default JoinGamePage;
