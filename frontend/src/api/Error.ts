export type ErrorResponse = {
  error: boolean,
  status: string,
  message: string;
};

type AxiosError = {
  response?: {
    status: string,
    data: any,
  },
};

export const errorHandler = (err: AxiosError): ErrorResponse => {
  if (!err.response) {
    return {
      error: true,
      status: 'XXX',
      message: 'An error occurred initiating the REST request',
    };
  }

  return {
    error: true,
    status: err.response.status,
    message: err.response.data.message,
  };
};

export const isError = (res: any): boolean => res && res.error;
