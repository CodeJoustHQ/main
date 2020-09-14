import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';

let stompClient: Client;

export type User = {
  nickname: string;
}

// Variable to hold the current connected state.
let connected: boolean = false;

// Create constants for the connection, subscription, and send message URLs.
export const SOCKET_ENDPOINT:string = '/api/v1/socket/join-room-endpoint';
const SUBSCRIBE_URL:string = '/api/v1/socket/subscribe-user';
const ADD_USER_URL:string = '/api/v1/socket/add-user';
const DELETE_USER_URL:string = '/api/v1/socket/delete-user';

export const isValidNickname = (nickname: string) => {
  return nickname.length > 0 && !nickname.includes(' ')
    && nickname.length <= 16;
};

export const addUser = (nickname:string) => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(ADD_USER_URL, {}, nickname);
  }
};

export const deleteUser = (nickname:string) => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(DELETE_USER_URL, {}, nickname);
  }
};

export const connect = (endpoint:string, nickname:string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  if (!connected) {
    // Connect to given endpoint, subscribe to future messages, and send user message.
    const socket: WebSocket = new SockJS(endpoint);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(SUBSCRIBE_URL, (users: Message) => {
        const userObjects:User[] = JSON.parse(users.body);
        setUsers(userObjects);
      });
      addUser(nickname);
    });
    // Reassign connected variable.
    connected = true;
  }
};

export const disconnect = () => {
  if (connected) {
    stompClient.disconnect(() => {
      // Reassign connected variable.
      connected = false;
    });
  }
};
