import axios from 'axios';
import { axiosErrorHandler } from './Error';

const basePath = '/api/v1';
const routes = {
  getInstant: () => `${basePath}/get-instant`,
};

// Get the current Instant from the backend, rather than local system.
export const getInstant = ():
  Promise<string> => axios.post<string>(routes.getInstant())
  .then((res) => res.data)
  .catch((err) => {
    throw axiosErrorHandler(err);
  });

export default getInstant;
