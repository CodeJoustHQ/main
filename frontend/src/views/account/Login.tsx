import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from '../../util/Hook';
import { TextInput } from '../../components/core/Input';
import { LandingHeaderTitle } from '../../components/core/Text';
import ErrorMessage from '../../components/core/Error';
import { PrimaryButton } from '../../components/core/Button';
import { TextLink } from '../../components/core/Link';

const LoginInput = styled(TextInput)`
  display: block;
  margin: 15px auto;
  width: 20rem;
`;

function LoginPage() {
  const { account } = useAppSelector((state) => state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (account) {
    return <Redirect to="/" />;
  }

  const handleChange = (func: (val: string) => void, val: string) => {
    func(val);
    setError('');
  };

  const onSubmit = () => {
    if (!email || !password) {
      setError('Please enter a value for each field.');
    }
  };

  return (
    <div>
      <LandingHeaderTitle>
        Login
      </LandingHeaderTitle>
      <div>
        <LoginInput
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => handleChange(setEmail, e.target.value)}
        />
        <LoginInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => handleChange(setPassword, e.target.value)}
        />
        <TextLink to="/register">Or register an account &#8594;</TextLink>
      </div>
      <PrimaryButton onClick={onSubmit}>
        Login
      </PrimaryButton>

      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}

export default LoginPage;
