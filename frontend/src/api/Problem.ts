import axios from 'axios';
import { axiosErrorHandler } from './Error';
import Difficulty from './Difficulty';

export type TestCase = {
  input: string,
  output: string,
  hidden: boolean,
};

export type Problem = {
  problemId: string,
  name: string,
  description: string,
  testCases: TestCase[],
  methodName: string,
  parameterTypes: ProblemIO[],
  parameterNames: string,
  outputType: ProblemIO
};

export type SubmissionResult = {
  status: string,
  output: string,
};

export type ProblemSettings = {
  difficulty: Difficulty,
};

export enum ProblemIO {
  STRING,
  STRING_LIST,
  STRING_DICTIONARY,
  INTEGER,
  INTEGER_LIST,
  INTEGER_DICTIONARY,
  BOOLEAN,
  BOOLEAN_LIST,
  BOOLEAN_DICTIONARY,
  VOID,
}
// Eventually add custom types such as nodes

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  createProblem: `${basePath}/`,
  getRandomProblem: `${basePath}/random`,
  getSingleProblem: (problemId: string) => `${basePath}/${problemId}`,
  createTestCase: (problemId: string) => `${basePath}/${problemId}/test-case`,
};

export const getProblems = (): Promise<Problem[]> => axios
  .get<Problem[]>(routes.getProblems)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const getRandomProblem = (request: ProblemSettings): Promise<Problem> => axios
  .get<Problem>(`${routes.getRandomProblem}?${new URLSearchParams(request).toString()}`)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
