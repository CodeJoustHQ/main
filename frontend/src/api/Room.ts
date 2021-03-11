import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { User } from './User';
import { Difficulty } from './Difficulty';

export type Room = {
  roomId: string,
  host: User,
  users: User[],
  activeUsers: User[],
  inactiveUsers: User[],
  active: boolean,
  difficulty: Difficulty,
  duration: number,
};

export type CreateRoomParams = {
  host: User,
};

export type JoinRoomParams = {
  user: User,
};

export type UpdateSettingsParams = {
  initiator: User,
  difficulty?: Difficulty,
  duration?: number,
};

export type ChangeHostParams = {
  initiator: User,
  newHost: User,
};

export type RemoveUserParams = {
  initiator: User,
  userToDelete: User,
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}`,
  joinRoom: (roomId: string) => `${basePath}/${roomId}/users`,
  getRoom: (roomId: string) => `${basePath}/${roomId}`,
  updateRoomSettings: (roomId: string) => `${basePath}/${roomId}/settings`,
  changeRoomHost: (roomId: string) => `${basePath}/${roomId}/host`,
  removeUser: (roomId: string) => `${basePath}/${roomId}/users`,
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

export const updateRoomSettings = (roomId: string, roomParams: UpdateSettingsParams):
  Promise<Room> => axios.put<Room>(routes.updateRoomSettings(roomId), roomParams)
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

export const removeUser = (roomId: string, roomParams: RemoveUserParams):
  Promise<Room> => axios({
  url: routes.removeUser(roomId),
  method: 'DELETE',
  data: roomParams,
})
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
