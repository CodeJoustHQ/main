import axios from 'axios';
import { ErrorResponse, errorHandler } from './Error';

export type Problem = {
  id: number,
  name: string,
  description: string;
}

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  postProblem: `${basePath}/`,
};

export const getProblems = (): Promise<Problem[] | ErrorResponse> => axios
  .get<Problem[]>(routes.getProblems)
  .then((res) => res.data)
  .catch((err) => errorHandler(err));
