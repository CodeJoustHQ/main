import axios from 'axios';
import { axiosErrorHandler } from './Error';

export type TestCase = {
  input: string,
  output: string,
  hidden: boolean,
};

export type Problem = {
  problemId: string,
  name: string,
  description: string;
  testCases: TestCase[],
};

export type SubmissionResult = {
  status: string,
  output: string,
};

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  createProblem: `${basePath}/`,
  getSingleProblem: (problemId: string) => `${basePath}/${problemId}`,
  createTestCase: (problemId: string) => `${basePath}/${problemId}/test-case`,
};

export const getProblems = (): Promise<Problem[]> => axios
  .get<Problem[]>(routes.getProblems)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
