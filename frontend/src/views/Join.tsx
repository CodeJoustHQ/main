import React, { useState, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { LargeText, UserNicknameText } from '../components/core/Text';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import {
  connect, deleteUser, SOCKET_ENDPOINT, User,
} from '../api/Socket';

type JoinGamePageProps = {
  initialUsers?: User[],
  initialPageState?: number,
  initialNickname?: string;
}

function JoinGamePage() {
  // Grab initial state variables if navigated from the create page.
  const location = useLocation<JoinGamePageProps>();
  let joinGamePageProps: JoinGamePageProps = {};
  if (location && location.state) {
    joinGamePageProps = {
      initialUsers: location.state.initialUsers,
      initialPageState: location.state.initialPageState,
      initialNickname: location.state.initialNickname,
    };
  }

  // Variable to hold the users on the page.
  const [users, setUsers] = useState<User[]>(joinGamePageProps.initialUsers || []);

  /**
   * Stores the current page state, where:
   * 0 = Enter room ID state (currently unused)
   * 1 = Enter nickname state
   * 2 = Waiting room state
   */
  const [pageState, setPageState] = useState(joinGamePageProps.initialPageState || 1);

  // Declare nickname state variable.
  const [nickname, setNickname] = useState(joinGamePageProps.initialNickname || '');

  // This function will be called after the nickname is entered.
  const enterNicknameAction = () => new Promise<undefined>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(SOCKET_ENDPOINT, nickname).then((result) => {
      setUsers(result);
      setPageState(2);
      resolve();
    }).catch((response) => {
      reject(errorHandler(response.message));
    });
  });

  // Create variable to hold the "Join Page" content.
  let joinPageContent: ReactElement | undefined;

  switch (pageState) {
    case 1:
      // Render the "Enter nickname" state.
      joinPageContent = (
        <EnterNicknamePage
          nickname={nickname}
          setNickname={setNickname}
          enterNicknamePage={ENTER_NICKNAME_PAGE.JOIN}
          enterNicknameAction={enterNicknameAction}
        />
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
          <div>
            {
              users.map((user) => (
                <UserNicknameText onClick={(event) => {
                  deleteUser((event.target as HTMLElement).innerText);
                }}
                >
                  {user.nickname}
                </UserNicknameText>
              ))
            }
          </div>
        </div>
      );
      break;
    default:
  }

  return joinPageContent;
}

export default JoinGamePage;
