import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient:any = null;

export const connect = (endpoint:string) => {
  const socket:any = new SockJS(endpoint);
  stompClient = Stomp.over(socket);
  stompClient.connect();
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
};
