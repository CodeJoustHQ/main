import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { User } from './Socket';

export type Room = {
  message: string,
  roomId: string;
};

export type CreateRoomParams = {
  host: {
    nickname: string;
  };
};

export type JoinRoomParams = {
  roomId: string,
  user: User,
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
};

export const createRoom = (roomParams: CreateRoomParams):
  Promise<Room> => axios.post<Room>(routes.createRoom, roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const joinRoom = (roomParams: JoinRoomParams):
  Promise<Room> => axios.put<Room>(routes.joinRoom, roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
