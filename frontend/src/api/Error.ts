/**
 * The various types of errors that can occur. 'AXIOS' and 'FRONTEND'
 * are errors generated from the frontend, and the rest correspond
 * with the enum error names on the backend.
 */
export type FrontendError
  = 'AXIOS'
  | 'FRONTEND';

export type GenericError
  = 'BAD_SETTING'
  | 'EMPTY_FIELD'
  | 'INVALID_PERMISSIONS'
  | 'NOT_FOUND';

export type AccountError
  = 'BAD_ROLE'
  | 'INVALID_CREDENTIALS';

export type GameError
  = 'BAD_LANGUAGE'
  | 'GAME_NOT_OVER'
  | 'TESTER_ERROR'
  | 'USER_NOT_IN_GAME';

export type NotificationError
  = 'BAD_NOTIFICATION_TYPE'
  | 'NOTIFICATION_REQUIRES_CONTENT'
  | 'NOTIFICATION_REQUIRES_INITIATOR';

export type ProblemError
  = 'BAD_DIFFICULTY'
  | 'BAD_INPUT'
  | 'BAD_IOTYPE'
  | 'BAD_PROBLEM_TAG'
  | 'BAD_VERIFIED_STATUS'
  | 'DUPLICATE_TAG_NAME'
  | 'INCORRECT_INPUT_COUNT'
  | 'INVALID_INPUT'
  | 'INVALID_NUMBER_REQUEST'
  | 'INVALID_VARIABLE_NAME'
  | 'INTERNAL_ERROR'
  | 'NOT_ENOUGH_FOUND'
  | 'TAG_NAME_ALREADY_EXISTS'
  | 'TAG_NOT_FOUND';

export type RoomError
  = 'ACTIVE_GAME'
  | 'ALREADY_FULL'
  | 'BAD_ROOM_SIZE'
  | 'DUPLICATE_USERNAME'
  | 'INACTIVE_USER'
  | 'NO_HOST'
  | 'TOO_MANY_PROBLEMS'
  | 'USER_NOT_FOUND';

export type TimerError
  = 'INVALID_DURATION'
  | 'NULL_SETTING';

export type UserError
  = 'IN_ROOM'
  | 'INVALID_USER';

// todo: verify that tester errors follow same format and fill
// the remainder of these in
export type TesterError
  = 'TODO'
  | 'TODO2';

export type ErrorType
  = FrontendError
  | GenericError
  | GameError
  | NotificationError
  | ProblemError
  | RoomError
  | UserError
  | TimerError
  | AccountError
  | TesterError;

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
