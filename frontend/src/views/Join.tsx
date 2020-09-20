import React, { useState, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, UserNicknameText } from '../components/core/Text';
import { ENTER_NICKNAME_PAGE, EnterNicknamePage } from '../components/core/EnterNickname';
import { errorHandler } from '../api/Error';
import {
  addUser, SUBSCRIBE_URL,
  connect, deleteUser, SOCKET_ENDPOINT, subscribe, User,
} from '../api/Socket';
import ErrorMessage from '../components/core/Error';

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

  // Hold error text.
  const [error, setError] = useState('');

  // Variable to hold the users on the page.
  const [users, setUsers] = useState<User[]>(joinGamePageProps.initialUsers || []);

  /**
   * Stores the current page state, where:
   * 0 = Enter room ID state (currently unused)
   * 1 = Enter nickname state
   * 2 = Waiting room state
   */
  const [pageState, setPageState] = useState(joinGamePageProps.initialPageState || 1);

  /**
   * Nickname that is populated if the join page is on the waiting room stage.
   * Set error if no nickname is passed in despite the waiting room stage.
   */
  const nickname: string | undefined = joinGamePageProps.initialNickname;
  if (pageState === 2 && !nickname) {
    setError('No nickname was provided for the user in the waiting room.');
  }

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
   * This method returns a Promise which is used to trigger setLoading
   * and setError on the EnterNickname page following this function.
   */
  const addUserToWaitingRoom = (socketEndpoint: string,
    subscribeUrl: string, nicknameParam: string) => new Promise<undefined>((resolve, reject) => {
      connect(socketEndpoint).then(() => {
        subscribe(subscribeUrl, subscribeCallback).then(() => {
          try {
            addUser(nicknameParam);
            setPageState(2);
            resolve();
          } catch (err) {
            reject(errorHandler(err.message));
          }
        }).catch((err) => {
          reject(errorHandler(err.message));
        });
      }).catch((err) => {
        reject(errorHandler(err.message));
      });
    });

  // Create variable to hold the "Join Page" content.
  let joinPageContent: ReactElement | undefined;

  switch (pageState) {
    case 1:
      // Render the "Enter nickname" state.
      joinPageContent = (
        <EnterNicknamePage
          enterNicknamePageType={ENTER_NICKNAME_PAGE.JOIN}
          // Partial application of addUserToWaitingRoom function.
          enterNicknameAction={
            (nicknameParam: string) => {
              addUserToWaitingRoom(SOCKET_ENDPOINT, SUBSCRIBE_URL,
                nicknameParam);
            }
          }
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
          { error ? <ErrorMessage message={error} /> : null }
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
