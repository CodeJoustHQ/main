import axios from 'axios';
import { ErrorResponse, errorHandler } from './Error';

export type Problem = {
  problemId: string,
  name: string,
  description: string;
}

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  createProblem: `${basePath}/`,
  getSingleProblem: (problemId: string) => `${basePath}/${problemId}`,
  createTestCase: (problemId: string) => `${basePath}/${problemId}/test-case`,
};

export const getProblems = (): Promise<Problem[] | ErrorResponse> => axios
  .get<Problem[]>(routes.getProblems)
  .then((res) => res.data)
  .catch((err) => errorHandler(err));
