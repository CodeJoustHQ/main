import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { User } from './User';

export type StartGameParams = {
  initiator: User,
};

export const startGame = (params: StartGameParams):
  Promise<void> => axios.post<void>('/api/v1/rooms/{currentRoomId}/start', params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
