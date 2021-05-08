import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { Problem } from './Problem';

export type Account = {
  uid: string,
  problems: Problem[],
};

export type AccountUid = {
  uid: string,
};

const basePath = '/api/v1/accounts';
const routes = {
  getProblems: (uid: string, token: string) => `${basePath}/${uid}?token=${token}`,
};

export const getAccount = (uid: string, token: string): Promise<Account> => axios
  .get<Account>(routes.getProblems(uid, token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
