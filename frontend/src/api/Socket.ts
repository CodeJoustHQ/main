import { Dispatch, SetStateAction } from 'react';
/* eslint-disable consistent-return */
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';
import { errorHandler } from './Error';

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
 * @returns error, if present
*/
export const addUser = (nickname:string): Error | undefined => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(ADD_USER_URL, {}, nickname);
  } else if (!connected) {
    return new Error('The socket is not connected.');
  } else {
    return new Error('The provided nickname is invalid.');
  }
};

/**
 * Delete the user by sending a message via socket.
 * @returns error, if present
*/
export const deleteUser = (nickname:string): Error | undefined => {
  if (connected && isValidNickname(nickname)) {
    stompClient.send(DELETE_USER_URL, {}, nickname);
  } else if (!connected) {
    return new Error('The socket is not connected.');
  } else {
    return new Error('The provided nickname is invalid.');
  }
};

/**
 * Connect and subscribe the user via socket.
 * @returns error, if present
*/
export const connect = (endpoint:string, nickname:string,
  setUsers?: Dispatch<SetStateAction<User[]>>):
  Promise<User[]> => new Promise<User[]>((resolve, reject) => {
    if (!connected) {
      // Connect to given endpoint, subscribe to future messages, and send user message.
      const socket: WebSocket = new SockJS(endpoint);
      stompClient = Stomp.over(socket);
      stompClient.connect({}, () => {
        stompClient.subscribe(SUBSCRIBE_URL, (users: Message) => {
          const userObjects:User[] = JSON.parse(users.body);
          // Set the users for the join page.
          if (setUsers) {
            setUsers(userObjects);
          }
          resolve(userObjects);
        });
        // Reassign connected variable.
        connected = true;
        if (addUser(nickname) !== undefined) {
          reject(errorHandler('The socket failed to add the user.'));
        }
      }, () => {
        reject(errorHandler('The socket failed to connect.'));
      });
    } else {
      reject(errorHandler('The socket is already connected.'));
    }
  });

/**
 * Disconnect the user by sending a message via socket.
 * @returns error, if present
*/
export const disconnect = ():
  Promise<undefined> => new Promise<undefined>((resolve, reject) => {
    if (connected) {
      const socket: WebSocket = new SockJS('/api/v1/socket/join-room-endpoint');
      stompClient = Stomp.over(socket);
      stompClient.disconnect(() => {
        // Reassign connected variable.
        connected = false;
        resolve();
      });
    } else {
      reject(errorHandler('The socket is not connected.'));
    }
  });
