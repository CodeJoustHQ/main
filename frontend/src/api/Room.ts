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
  user: User,
};

export type ChangeHostParams = {
  initiator: User,
  newHost: User,
}

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/create`,
  joinRoom: (roomId: string) => `${basePath}/${roomId}/join`,
  getRoom: (roomId: string) => `${basePath}/${roomId}`,
  changeRoomHost: (roomId: string) => `${basePath}/${roomId}/host`,
};

export const createRoom = (roomParams: CreateRoomParams):
  Promise<Room> => axios.post<Room>(routes.createRoom, roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const joinRoom = (roomId: string, roomParams: JoinRoomParams):
  Promise<Room> => axios.put<Room>(routes.joinRoom(roomId), roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const getRoom = (roomId: string):
  Promise<Room> => axios.get<Room>(routes.getRoom(roomId))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const changeRoomHost = (roomId: string, roomParams: ChangeHostParams):
  Promise<Room> => axios.put<Room>(routes.changeRoomHost(roomId), roomParams)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
