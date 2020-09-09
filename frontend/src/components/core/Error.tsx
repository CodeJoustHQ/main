import React from 'react';
import { ErrorText } from './Text';

type MyProps = {
  message: string,
}

function ErrorMessage(props: MyProps) {
  const { message } = props;
  return (
    <ErrorText>
      {message}
    </ErrorText>
  );
}

export default ErrorMessage;
