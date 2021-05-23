import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { GameTimer } from './GameTimer';
import { Room } from './Room';
import { User } from './User';
import { Problem } from './Problem';
import { Color } from './Color';

export type Player = {
  user: User,
  code: string,
  language: string,
  submissions: Submission[],
  solved: boolean,
  color: Color,
};

export type Game = {
  room: Room,
  players: Player[],
  gameTimer: GameTimer,
  problems: Problem[],
  playAgain: boolean,
  allSolved: boolean,
  gameEnded: boolean,
};

export type StartGameParams = {
  initiator: User,
};

export type PlayAgainParams = {
  initiator: User,
};

export type EndGameParams = {
  initiator: User,
};

export type RunSolutionParams = {
  initiator: User,
  input: string,
  code: string,
  language: string,
};

export type SubmitSolutionParams = {
  initiator: User,
  code: string,
  language: string,
};

export type SubmissionResult = {
  console: string,
  userOutput: string,
  error: string,
  input: string,
  correctOutput: string,
  hidden: boolean,
  correct: boolean,
};

// Distinguish on frontend between tests and submissions.
export enum SubmissionType {
  Test = 'TEST',
  Submit = 'SUBMIT',
}

export type Submission = {
  code: string,
  language: string,
  results: SubmissionResult[],
  numCorrect: number,
  numTestCases: number,
  runtime: number,
  compilationError: string,
  startTime: string,
  submissionType: SubmissionType,
};

const basePath = '/api/v1';
const routes = {
  startGame: (roomId: string) => `${basePath}/rooms/${roomId}/start`,
  getGame: (roomId: string) => `${basePath}/games/${roomId}`,
  runCode: (roomId: string) => `${basePath}/games/${roomId}/run-code`,
  submitSolution: (roomId: string) => `${basePath}/games/${roomId}/submission`,
  endGame: (roomId: string) => `${basePath}/games/${roomId}/game-over`,
  playAgain: (roomId: string) => `${basePath}/games/${roomId}/restart`,
};

export const startGame = (roomId: string, params: StartGameParams):
  Promise<Room> => axios.post<Room>(routes.startGame(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const getGame = (roomId: string):
  Promise<Game> => axios.get<Game>(routes.getGame(roomId))
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const runSolution = (roomId: string, params: RunSolutionParams):
  Promise<Submission> => axios.post<Submission>(routes.runCode(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const submitSolution = (roomId: string, params: SubmitSolutionParams):
  Promise<Submission> => axios.post<Submission>(routes.submitSolution(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const playAgain = (roomId: string, params: PlayAgainParams):
  Promise<Room> => axios.post<Room>(routes.playAgain(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const manuallyEndGame = (roomId: string, params: EndGameParams):
  Promise<Room> => axios.post<Room>(routes.endGame(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
