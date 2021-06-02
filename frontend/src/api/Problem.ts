import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { Difficulty } from './Difficulty';
import Language from './Language';
import { AccountUid } from './Account';
import { getAuthHttpHeader } from '../util/Utility';

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
  owner: AccountUid,
  description: string,
  approval: boolean,
  difficulty: Difficulty,
  testCases: TestCase[],
  problemInputs: ProblemInput[],
  problemTags: ProblemTag[],
  outputType: ProblemIOType,
};

export type SelectableProblem = {
  problemId: string,
  name: string,
  difficulty: Difficulty,
  selected?: boolean,
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

export type ProblemTag = {
  name: string,
  tagId?: string,
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
  getProblemsWithTag: (tagId: string) => `${basePath}/tags/${tagId}`,
  getAllProblemTags: `${basePath}/tags`,
  createProblemTag: `${basePath}/tags`,
  deleteProblemTag: (tagId: string) => `${basePath}/tags/${tagId}`,
};

export const getProblems = (token: string, approved?: boolean): Promise<Problem[]> => axios
  .get<Problem[]>(approved ? `${routes.getProblems}?approved=true` : routes.getProblems, getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const getSingleProblem = (problemId: string, token: string): Promise<Problem> => axios
  .get<Problem>(routes.getSingleProblem(problemId), getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const createProblem = (problem: Problem, token: string): Promise<Problem> => axios
  .post<Problem>(routes.createProblem, problem, getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const editProblem = (problemId: string,
  updatedProblem: Problem, token: string): Promise<Problem> => axios
  .put<Problem>(routes.editProblem(problemId), updatedProblem, getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const deleteProblem = (problemId: string, token: string): Promise<Problem> => axios
  .delete<Problem>(routes.deleteProblem(problemId), getAuthHttpHeader(token))
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

export const getAllProblemTags = (token: string): Promise<ProblemTag[]> => axios
  .get<ProblemTag[]>(routes.getAllProblemTags, getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const createProblemTag = (tag: ProblemTag, token: string): Promise<ProblemTag> => axios
  .post<ProblemTag>(routes.createProblemTag, tag, getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const deleteProblemTag = (tagId: string, token: string): Promise<ProblemTag> => axios
  .post<ProblemTag>(routes.deleteProblemTag(tagId), getAuthHttpHeader(token))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
