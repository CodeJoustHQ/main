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
  submissions: SubmissionResult[],
  solved: boolean,
  color: Color,
};

export type Game = {
  room: Room,
  players: Player[],
  gameTimer: GameTimer,
  problems: Problem[],
};

export type StartGameParams = {
  initiator: User,
};

export type PlayAgainParams = {
  initiator: User,
};

export type SubmitSolutionParams = {
  initiator: User,
  code: string,
  language: string,
};

export type SubmissionResult = {
  code: string,
  language: string,
  numCorrect: number,
  numTestCases: number,
  startTime: string,
};

const basePath = '/api/v1';
const routes = {
  startGame: (roomId: string) => `${basePath}/rooms/${roomId}/start`,
  getGame: (roomId: string) => `${basePath}/games/${roomId}`,
  submitSolution: (roomId: string) => `${basePath}/games/${roomId}/submission`,
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

export const submitSolution = (roomId: string, params: SubmitSolutionParams):
  Promise<SubmissionResult> => axios.post<SubmissionResult>(routes.submitSolution(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export const playAgain = (roomId: string, params: PlayAgainParams):
  Promise<SubmissionResult> => axios.post<SubmissionResult>(routes.submitSolution(roomId), params)
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });
