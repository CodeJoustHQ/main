import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector, useAuthCheck } from '../../util/Hook';
import { AuthInput, AuthPasswordInput } from '../../components/core/Input';
import { LandingHeaderTitle } from '../../components/core/Text';
import ErrorMessage from '../../components/core/Error';
import { PrimaryButton } from '../../components/core/Button';
import { TextLink } from '../../components/core/Link';
import app from '../../api/Firebase';
import Loading from '../../components/core/Loading';
import GoogleLogin from '../../components/config/GoogleLogin';
import { onEnterAction } from '../../util/Utility';

type RedirectProps = {
  from?: string,
};

function LoginPage() {
  const history = useHistory();
  const location = useLocation<RedirectProps>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAction = useCallback(() => history.replace(location.state?.from || '/'), [history, location]);

  // Redirect if logged in already
  useAuthCheck(redirectAction, setError);

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
    <>
      <LandingHeaderTitle>
        Login
      </LandingHeaderTitle>
      <div>
        <AuthInput
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => handleChange(setEmail, e.target.value)}
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <AuthPasswordInput
          placeholder="Password"
          name="password"
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
    </>
  );
}

export default LoginPage;
