import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

type User = {
  nickname: string;
}

// Create constants for the subscription and send message URLs.
const SUBSCRIBE_URL:string = '/api/v1/socket/subscribe-user';
const SEND_USER_URL:string = '/api/v1/socket/user';

export const sendGreeting = (nickname:string) => {
  const nicknameInput:string = (nickname !== '') ? nickname : 'Anonymous';
  stompClient.send(SEND_USER_URL, {}, nicknameInput);
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
