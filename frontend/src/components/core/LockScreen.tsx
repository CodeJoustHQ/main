import React, { useState } from 'react';
import styled from 'styled-components';
import { InlineShowIcon } from './Button';
import ErrorMessage from './Error';
import { LargeCenterPassword, PrimaryInput } from './Input';
import Loading from './Loading';
import { LargeText, SmallHoverText } from './Text';

const Content = styled.div`
  padding: 0 20%;
  margin-top: 8rem;
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Content>
      <LargeText>
        What is the password?
      </LargeText>
      <LargeCenterPassword
        show={showPassword}
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
      <SmallHoverText
        onClick={togglePasswordVisibility}
      >
        {showPassword ? 'Hide' : 'Show'}
        <InlineShowIcon>
          {showPassword ? 'visibility_off' : 'visibility'}
        </InlineShowIcon>
      </SmallHoverText>
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
