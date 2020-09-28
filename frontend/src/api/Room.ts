import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { User } from './User';

export type Room = {
  roomId: string;
  host: User;
  users: [User],
};

export type CreateRoomParams = {
  host: User;
};

export type JoinRoomParams = {
  roomId: string,
  user: User,
};

type GetResponse = {
  roomId: string;
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
  getRoom: `${basePath}/`,
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

export const verifyRoomExists = (roomId: string):
  Promise<GetResponse> => axios.get<GetResponse>(`${routes.getRoom}?roomId=${roomId}`)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
