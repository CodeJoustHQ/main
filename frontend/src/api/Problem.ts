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

<<<<<<< HEAD
export const getProblems = (): Promise<Problem[]> => axios.get<Problem[]>(routes.getProblems)
  .then((res: { data: Problem[]; }) => res.data);

export default getProblems;
=======
export const getProblems = (): Promise<Problem[] | ErrorResponse> => axios
  .get<Problem[]>(routes.getProblems)
  .then((res) => res.data)
  .catch((err) => errorHandler(err));
>>>>>>> master
