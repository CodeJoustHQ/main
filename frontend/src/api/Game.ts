import axios from 'axios';
import { axiosErrorHandler } from './Error';
import { Room } from './Room';
import { User } from './User';

export type Game = {
  roomDto: Room,
};

export type StartGameParams = {
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
  numTestCases: string,
};

const basePath = '/api/v1';
const routes = {
  startGame: (roomId: string) => `${basePath}/rooms/${roomId}/start`,
  getGame: (roomId: string) => `${basePath}/games/${roomId}`,
  submitSolution: (roomId: string) => `${basePath}/games/${roomId}/submission`,
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
