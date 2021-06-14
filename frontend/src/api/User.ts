import axios from 'axios';
import { getAuthHttpHeader } from '../util/Utility';
import { AccountUid } from './Account';
import { axiosErrorHandler } from './Error';

export type User = {
  nickname: string,
  userId?: string,
  spectator?: boolean,
  sessionId?: string,
  accountUid?: AccountUid,
};

const basePath = '/api/v1/rooms';
const routes = {
  updateUserAccount: (userId: string) => `${basePath}/user/${userId}/account`,
};

export const updateUserAccount = (userId: string, token: string | null):
  Promise<User> => axios.post<User>(routes.updateUserAccount(userId), getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
