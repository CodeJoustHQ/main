import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

// Create constants for the subscription and send message URLs.
const SUBSCRIBE_URL:string = '/api/v1/socket/receive-greeting';
const SEND_URL:string = '/api/v1/socket/receive-greeting';

export const sendMessage = (nickname:string) => {
  const nicknameInput:string = (nickname !== '') ? nickname : 'Anonymous';
  stompClient.send(SEND_URL, {}, `Welcome ${nicknameInput} to the page!`);
};

export const connect = (endpoint:string, nickname:string) => {
  const socket:any = new SockJS(endpoint);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe(SUBSCRIBE_URL, (greeting:any) => {
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
