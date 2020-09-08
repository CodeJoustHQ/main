import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

type Color = {
  alpha: number;
  red: number;
  green: number;
  blue: number;
  rgb: number;
  transparency: number;
  colorSpace: any;
}

type User = {
  color: Color;
  id: number;
  nickname: string;
}

// Create constants for the subscription and send message URLs.
const SUBSCRIBE_URL:string = '/api/v1/socket/subscribe-user-list';
const SEND_GREETING_URL:string = '/api/v1/socket/user-list';

export const sendGreeting = (nickname:string) => {
  const nicknameInput:string = (nickname !== '') ? nickname : 'Anonymous';
  stompClient.send(SEND_GREETING_URL, {}, nicknameInput);
};

export const connect = (endpoint:string, nickname:string) => {
  const socket:any = new SockJS(endpoint);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe(SUBSCRIBE_URL, (userList:any) => {
      const userListObject:User = JSON.parse(userList.body);
      console.log(`Welcome ${userListObject.nickname} to the page!`);
    });
    sendGreeting(nickname);
  });
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
};
