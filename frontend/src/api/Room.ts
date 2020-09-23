import axios from 'axios';
import { axiosErrorHandler } from './Error';

export type User = {
  nickname: string,
}

export type Room = {
  roomId: string;
  host: User;
  users: [User],
};

export type RoomParams = {
  host: User;
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
};

export const createRoom = (roomParams: RoomParams):
  Promise<Room> => axios.post<Room>(routes.createRoom, roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
