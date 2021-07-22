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

// Includes ProblemErrors in both main and tester
export type ProblemError
  = 'BAD_DIFFICULTY'
  | 'BAD_INPUT'
  | 'BAD_IOTYPE'
  | 'BAD_PARAMETER_SETTINGS'
  | 'BAD_PROBLEM_TAG'
  | 'BAD_VERIFIED_STATUS'
  | 'DUPLICATE_TAG_NAME'
  | 'INVALID_NUMBER_REQUEST'
  | 'INVALID_VARIABLE_NAME'
  | 'INTERNAL_ERROR'
  | 'NOT_ENOUGH_FOUND'
  | 'OBJECT_MATCH_IOTYPE'
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

export type TestCaseError
  = 'INCORRECT_INPUT_COUNT'
  | 'INVALID_INPUT';

export type TimerError
  = 'INVALID_DURATION'
  | 'NULL_SETTING';

export type UserError
  = 'IN_ROOM'
  | 'INVALID_USER';

/**
 * The following are the errors that originate from the tester repo,
 * but can propagate through main via TesterError. ProblemError,
 * TestCaseError, and RequestError are not included because they've
 * been accounted for by one of the above error strings.
 */
export type DockerError
  = 'BUILD_DOCKER_CONTAINER'
  | 'CREATE_TEMP_FOLDER'
  | 'DELETE_TEMP_FOLDER'
  | 'INVALID_DELETE_PATH'
  | 'WRITE_CODE_TO_DISK';

export type ParserError
  = 'BAD_SECTION'
  | 'INCORRECT_COUNT'
  | 'INVALID_OUTPUT'
  | 'MISFORMATTED_OUTPUT'
  | 'UNEXPECTED_ERROR';

export type LanguageError
  = 'BAD_LANGUAGE';

export type TesterError
  = DockerError
  | ParserError
  | LanguageError;

export type ErrorType
  = FrontendError
  | GenericError
  | AccountError
  | GameError
  | NotificationError
  | ProblemError
  | RoomError
  | TestCaseError
  | TimerError
  | UserError
  | TesterError;

export type ErrorResponse = {
  error: boolean,
  status: string,
  message: string,
  type: ErrorType,
  // Any data passed along with the error
  body?: any,
};

export type TestCaseErrorBody = {
  index: number,
  field: 'INPUT' | 'OUTPUT',
}

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
