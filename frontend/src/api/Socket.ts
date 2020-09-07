import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

// Create constants for the subscription and send message URLs.
const SUBSCRIBE_URL:string = '/api/v1/socket/subscribe-greeting';
const SEND_GREETING_URL:string = '/api/v1/socket/greeting';

export const sendMessage = (nickname:string) => {
  const nicknameInput:string = (nickname !== '') ? nickname : 'Anonymous';
  stompClient.send(SEND_GREETING_URL, {}, nicknameInput);
};

export const connect = (endpoint:string, nickname:string) => {
  const socket:any = new SockJS(endpoint);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe(SUBSCRIBE_URL, (greeting:any) => {
      console.log(greeting);
      console.log(greeting.body);
    });
    sendMessage(nickname);
  });
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
};
