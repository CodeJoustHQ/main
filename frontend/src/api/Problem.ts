import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { Difficulty } from './Difficulty';
import Language from './Language';

export type TestCase = {
  id: string,
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

export const problemIOTypeToString = (key: ProblemIOType): string => {
  switch (key) {
    case ProblemIOType.String:
      return 'String';
    case ProblemIOType.Integer:
      return 'Integer';
    case ProblemIOType.Double:
      return 'Double';
    case ProblemIOType.Character:
      return 'Character';
    case ProblemIOType.Boolean:
      return 'Boolean';
    case ProblemIOType.ArrayString:
      return 'ArrayString';
    case ProblemIOType.ArrayInteger:
      return 'ArrayInteger';
    case ProblemIOType.ArrayDouble:
      return 'ArrayDouble';
    case ProblemIOType.ArrayCharacter:
      return 'ArrayCharacter';
    case ProblemIOType.ArrayBoolean:
      return 'ArrayBoolean';
    default:
      return '';
  }
};

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
  editProblem: (problemId: string) => `${basePath}/${problemId}`,
  deleteProblem: (problemId: string) => `${basePath}/${problemId}`,
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

export const getSingleProblem = (problemId: string): Promise<Problem> => axios
  .get<Problem>(routes.getSingleProblem(problemId))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const createProblem = (problem: Problem): Promise<Problem> => axios
  .post<Problem>(routes.createProblem, problem)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const editProblem = (problemId: string, updatedProblem: Problem): Promise<Problem> => axios
  .put<Problem>(routes.editProblem(problemId), updatedProblem)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const deleteProblem = (problemId: string): Promise<Problem> => axios
  .delete<Problem>(routes.deleteProblem(problemId))
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
