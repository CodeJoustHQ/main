import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

type User = {
  nickname: string;
}

// Variable to hold the current connected state.
let connected = false;

// Create constants for the subscription and send message URLs.
const SUBSCRIBE_URL:string = '/api/v1/socket/subscribe-user';
const SEND_USER_URL:string = '/api/v1/socket/user';

export const sendUser = (nickname:string) => {
  if (connected) {
    stompClient.send(SEND_USER_URL, {}, nickname || 'Anonymous');
  } else {
    console.error('You must be connected to a socket before sending user information.');
  }
};

export const connect = (endpoint:string, nickname:string) => {
  if (!connected) {
    // Connect to given endpoint, subscribe to future messages, and send user message.
    const socket:any = new SockJS(endpoint);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(SUBSCRIBE_URL, (user:any) => {
        const userObject:User = JSON.parse(user.body);
        console.log(`Welcome ${userObject.nickname} to the page!`);
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
    stompClient.disconnect();
    stompClient = null;
    // Reassign connected variable.
    connected = false;
  } else {
    console.error('You cannot disconnect because you are not connected to any socket.');
  }
};
