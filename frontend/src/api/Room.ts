import axios from 'axios';
import { axiosErrorHandler } from './Error';

export type Room = {
  message: string,
  roomId: string;
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
};

export const createRoom = (): Promise<Room> => axios.post<Room>(routes.createRoom)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
