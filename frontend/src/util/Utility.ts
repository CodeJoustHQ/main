import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient:any = null;

export const Connect = (endpoint:string) => {
  let socket:any = new SockJS(endpoint);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, (frame:string) => {
    console.log('Connected: ' + frame);
  });
}

export const Disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log("Disconnected");
}
