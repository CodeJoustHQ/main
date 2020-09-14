/* eslint-disable consistent-return */
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';
import { SocketError } from './Error';

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

export const isValidNickname = (nickname: string) => nickname.length > 0
  && !nickname.includes(' ') && nickname.length <= 16;

/**
 * Add the user by sending a message via socket.
 * @returns socket error, if present
*/
export const addUser = (nickname:string): SocketError | undefined => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(ADD_USER_URL, {}, nickname);
  } else if (!connected) {
    const error: SocketError = {
      error: 'The socket is not connected.',
    };
    return error;
  } else {
    const error: SocketError = {
      error: 'The provided nickname is invalid.',
    };
    return error;
  }
};

/**
 * Delete the user by sending a message via socket.
 * @returns socket error, if present
*/
export const deleteUser = (nickname:string): SocketError | undefined => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(DELETE_USER_URL, {}, nickname);
  } else if (!connected) {
    return {
      error: 'The socket is not connected.',
    };
  } else {
    return {
      error: 'The provided nickname is invalid.',
    };
  }
};

/**
 * Connect and subscribe the user via socket.
 * @returns socket error, if present
*/
export const connect = (endpoint:string, nickname:string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>): SocketError | undefined => {
  if (!connected) {
    // Connect to given endpoint, subscribe to future messages, and send user message.
    const socket: WebSocket = new SockJS(endpoint);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(SUBSCRIBE_URL, (users: Message) => {
        const userObjects:User[] = JSON.parse(users.body);
        setUsers(userObjects);
      }, () => false);
      // Reassign connected variable.
      connected = true;
      return addUser(nickname);
    });
  } else {
    return {
      error: 'The socket is already connected.',
    };
  }
};

/**
 * Disconnect the user by sending a message via socket.
 * @returns socket error, if present
*/
export const disconnect = (): SocketError | undefined => {
  if (connected) {
    stompClient.disconnect(() => {
      // Reassign connected variable.
      connected = false;
    });
  } else {
    return {
      error: 'The socket is not connected.',
    };
  }
};
