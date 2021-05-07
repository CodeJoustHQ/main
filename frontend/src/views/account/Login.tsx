import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../util/Hook';
import { TextInput } from '../../components/core/Input';
import { LandingHeaderTitle } from '../../components/core/Text';
import ErrorMessage from '../../components/core/Error';
import { PrimaryButton } from '../../components/core/Button';
import { TextLink } from '../../components/core/Link';
import app from '../../api/Firebase';
import Loading from '../../components/core/Loading';
import GoogleLogin from '../../components/config/GoogleLogin';
import { onEnterAction } from '../../util/Utility';

const LoginInput = styled(TextInput)`
  display: block;
  margin: 15px auto;
  width: 20rem;
`;

type RedirectProps = {
  from?: string,
};

function LoginPage() {
  const history = useHistory();
  const location = useLocation<RedirectProps>();

  const { account } = useAppSelector((state) => state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAction = () => history.replace(location.state?.from || '/dashboard');

  if (account) {
    redirectAction();
  }

  const handleChange = (func: (val: string) => void, val: string) => {
    func(val);
    setError('');
  };

  const onSubmit = () => {
    if (!email || !password) {
      setError('Please enter a value for each field.');
      return;
    }

    setLoading(true);
    app.auth().signInWithEmailAndPassword(email, password)
      .then(redirectAction)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <LoginInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => handleChange(setPassword, e.target.value)}
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <TextLink to="/register">Or register an account &#8594;</TextLink>
      </div>
      <div>
        <PrimaryButton onClick={onSubmit}>
          Login
        </PrimaryButton>
        <GoogleLogin successAction={redirectAction} errorAction={setError} />
      </div>

      {loading ? <Loading /> : null}
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}

export default LoginPage;
