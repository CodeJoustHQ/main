import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { Room } from './Room';
import { User } from './User';

export type Game = {
  roomDto: Room,
};

export type StartGameParams = {
  initiator: User,
};

export const startGame = (roomId: string, params: StartGameParams):
  Promise<Room> => axios.post<Room>(`/api/v1/rooms/${roomId}/start`, params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const getGame = (roomId: string):
  Promise<Game> => axios.get<Game>(`/api/v1/games/${roomId}`)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
