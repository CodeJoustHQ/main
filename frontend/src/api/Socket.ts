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
const SEND_USER_URL:string = '/api/v1/socket/user';

export const sendUser = (nickname:string) => {
  if (connected) {
    stompClient.send(SEND_USER_URL, {}, nickname || 'Anonymous');
  } else {
    console.error('You must be connected to a socket before sending user information.');
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
        console.log(users);
        console.log(JSON.parse(users.body));
        const userObjects:User[] = JSON.parse(users.body);
        setUsers(userObjects);
        // console.log(`Welcome ${userObject.nickname} to the page!`);
      });
      sendUser(nickname);
    });
    // Reassign connected variable.
    connected = true;
  } else {
    console.error('You are already connected to a socket.');
  }
};

export const disconnect = () => {
  if (connected) {
    stompClient.disconnect(() => {
      // Reassign connected variable.
      connected = false;
    });
  } else {
    console.error('You cannot disconnect because you are not connected to any socket.');
  }
};
