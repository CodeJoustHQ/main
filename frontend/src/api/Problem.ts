import axios from 'axios';
import { axiosErrorHandler } from './Error';
import Difficulty from './Difficulty';
import Language from './Language';

export type TestCase = {
  input: string,
  output: string,
  hidden: boolean,
  explanation: string,
};

export type Problem = {
  problemId: string,
  name: string,
  description: string,
  difficulty: Difficulty,
  testCases: TestCase[],
  problemInputs: ProblemInput[],
  outputType: ProblemIOType,
};

export type ProblemInput = {
  name: string,
  type: ProblemIOType,
};

export enum ProblemIOType {
  String = 'STRING',
  Integer = 'INTEGER',
  Double = 'DOUBLE',
  Character = 'CHARACTER',
  Boolean = 'BOOLEAN',
  ArrayString = 'ARRAY_STRING',
  ArrayInteger = 'ARRAY_INTEGER',
  ArrayDouble = 'ARRAY_DOUBLE',
  ArrayCharacter = 'ARRAY_CHARACTER',
  ArrayBoolean = 'ARRAY_BOOLEAN',
}

export type ProblemSettings = {
  difficulty: Difficulty,
};

export type DefaultCodeType = {
  [language in Language]: string
};

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  createProblem: `${basePath}/`,
  getRandomProblem: `${basePath}/random`,
  getSingleProblem: (problemId: string) => `${basePath}/${problemId}`,
  createTestCase: (problemId: string) => `${basePath}/${problemId}/test-case`,
  defaultCodeMap: (problemId: string) => `${basePath}/${problemId}/default-code`,
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

export const getDefaultCodeMap = (problemId: string): Promise<DefaultCodeType> => axios
  .get<DefaultCodeType>(routes.defaultCodeMap(problemId))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
