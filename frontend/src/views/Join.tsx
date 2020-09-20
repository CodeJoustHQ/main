<<<<<<< HEAD
import React, { useState, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { LargeText, UserNicknameText } from '../components/core/Text';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import {
  addUser,
  connect, deleteUser, SOCKET_ENDPOINT, subscribe, User,
} from '../api/Socket';
import { Message } from 'stompjs';

type JoinGamePageProps = {
  initialUsers?: User[],
  initialPageState?: number,
  initialNickname?: string;
}
=======
import React, { useState, useEffect, ReactElement } from 'react';
import { Message } from 'stompjs';
import ErrorMessage from '../components/core/Error';
import { LargeText, Text, UserNicknameText } from '../components/core/Text';
import { LargeCenterInputText, LargeInputButton } from '../components/core/Input';
import {
  isValidNickname, connect, subscribe, deleteUser, User,
  SOCKET_ENDPOINT, SUBSCRIBE_URL, addUser,
} from '../api/Socket';

function JoinGamePage() {
  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  // Hold error text.
  const [error, setError] = useState('');

  /**
   * This is updated whenever the nickname changes.
   */
  const [validNickname, setValidNickname] = useState(false);
  useEffect(() => {
    setValidNickname(isValidNickname(nickname));
  }, [nickname]);
>>>>>>> 8275e6e5a3333165a943f6cd139f3f6e3733df35

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
    connect(SOCKET_ENDPOINT, nickname, setUsers).then((result) => {
      setUsers(result);
      setPageState(2);
      resolve();
    }).catch((response) => {
      reject(errorHandler(response.message));
    });
  });

  /**
   * Subscribe callback that will be triggered on every message.
   * Update the users list.
   */
  const subscribeCallback = (result: Message) => {
    const userObjects:User[] = JSON.parse(result.body);
    setUsers(userObjects);
  };

  /**
   * Add the user to the waiting room through the following steps.
   * 1. Connect the user to the socket.
   * 2. Subscribe the user to future messages.
   * 3. Send the user nickname to the room.
   * 4. Update the room layout to the "waiting room" page.
   * This method also handles any relevant errors.
   */
  const addUserToWaitingRoom = (socketEndpoint: string,
    subscribeUrl: string, nicknameParam: string) => {
    connect(socketEndpoint).then(() => {
      subscribe(subscribeUrl, subscribeCallback).then(() => {
        try {
          addUser(nicknameParam);
          setPageState(2);
        } catch (err) {
          setError(err.message);
        }
      }).catch((err) => {
        setError(err.message);
      });
    }).catch((err) => {
      setError(err.message);
    });
  };

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
