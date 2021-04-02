import React, { useState } from 'react';
import styled from 'styled-components';
import ErrorMessage from './Error';
import { LargeCenterInputText, PrimaryInput } from './Input';
import Loading from './Loading';
import { LargeText } from './Text';

const Content = styled.div`
  padding: 0 20%;
`;

type LockScreenProps = {
  loading: boolean,
  error: string,
  enterPasswordAction: (password: string) => void,
};

export default function LockScreen(props: LockScreenProps) {
  // Grab props variables.
  const {
    error, loading, enterPasswordAction,
  } = props;

  const [password, setPassword] = useState('');

  return (
    <Content>
      <LargeText>
        What is the password?
      </LargeText>
      <LargeCenterInputText
        placeholder="Password"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            enterPasswordAction(password);
          }
        }}
      />
      <PrimaryInput
        onClick={() => {
          enterPasswordAction(password);
        }}
        value="Enter"
        disabled={!password}
      />
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
    </Content>
  );
}
