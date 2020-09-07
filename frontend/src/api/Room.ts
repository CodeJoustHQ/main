import axios from 'axios';
import { ErrorResponse, errorHandler } from './Error';

export type Room = {
  message: string,
  roomId: string;
};

const basePath = 'http://localhost:8080/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
};

export const createRoom = (): Promise<Room | ErrorResponse> => axios.post<Room>(routes.createRoom)
  .then((res) => res.data)
  .catch((err) => errorHandler(err));
