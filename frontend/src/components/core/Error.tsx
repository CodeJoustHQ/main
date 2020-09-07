import React from 'react';
import styled from 'styled-components';
import { Text } from './Text';

const Content = styled.div`
  p {
    color: ${({ theme }) => theme.colors.red};
  }
`;

type MyProps = {
  message: string,
}

function ErrorMessage(props: MyProps) {
  const { message } = props;
  return (
    <Content>
      <Text>
        {message}
      </Text>
    </Content>
  );
}

export default ErrorMessage;
