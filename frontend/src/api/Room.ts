import axios from 'axios';
import { axiosErrorHandler } from './Error';

export type Room = {
  message: string,
  roomId: string;
};

export type RoomParams = {
  host: {
    nickname: string;
  };
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
