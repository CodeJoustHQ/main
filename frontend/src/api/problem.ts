export type Problem = {
  id: number,
  name: string;
  description: string;
}

const basePath = '/api/v1/problems';
const routes = {
  getProblems: `${basePath}/`,
  postProblem: `${basePath}/`,
};

export const getProblems = (): Promise<Problem[]> => fetch(routes.getProblems)
  .then((response) => response.json());
