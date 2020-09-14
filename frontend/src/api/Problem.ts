import axios from 'axios';

type Problem = {
  id: number,
  name: string;
  description: string;
}

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  postProblem: `${basePath}/`,
};

export const getProblems = (): Promise<Problem[]> => axios.get<Problem[]>(routes.getProblems)
  .then((res) => res.data);

export default getProblems;
