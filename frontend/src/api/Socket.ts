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
      const greetingObject:User = JSON.parse(greeting.body);
      console.log(`Welcome ${greetingObject.nickname} to the page!`);
      console.log(`Color: rgb(${greetingObject.color.red}, ${greetingObject.color.green}, ${greetingObject.color.blue})`);
    });
    sendMessage(nickname);
  });
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
};
