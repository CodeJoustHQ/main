/* eslint-disable no-multi-spaces */

// The type of error
export type ErrorType = 'AXIOS' | 'FRONTEND'
  // Generic errors
  | 'BAD_SETTING'
  | 'NOT_FOUND'
  | 'INVALID_PERMISSIONS'
  // GameErrors
  | 'BAD_LANGUAGE'
  | 'EMPTY_FIELD'
  | 'GAME_NOT_OVER'
  | 'NOTIFICATION_REQUIRES_INITIATOR'
  | 'NOTIFICATION_REQUIRES_CONTENT'
  | 'TESTER_ERROR'
  | 'USER_NOT_IN_GAME'

export type ErrorResponse = {
  error: boolean,
  status: string,
  message: string,
  type: ErrorType,
  // Any data passed along with the error
  data?: any,
};

export type AxiosError = {
  response?: {
    status: string,
    data: any,
  },
};

export const axiosErrorHandler = (err: AxiosError): ErrorResponse => {
  if (!err.response) {
    return {
      error: true,
      status: 'XXX', // Request didn't initiate; no status returned
      message: 'An error occurred initiating the REST request',
      type: 'AXIOS',
    };
  }

  return {
    error: true,
    status: err.response.status,
    message: err.response.data.message || 'An error occurred; please try again later.',
    type: err.response.data.type,
  };
};

export const errorHandler = (message: string): ErrorResponse => ({
  error: true,
  status: 'XXX',
  message: message || 'An error occurred; please try again later.',
  type: 'FRONTEND',
});
