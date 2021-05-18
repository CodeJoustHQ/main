import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import app from '../../api/Firebase';
import { useAppSelector } from '../../util/Hook';
import { AuthInput, AuthPasswordInput } from '../../components/core/Input';
import { PrimaryButton } from '../../components/core/Button';
import ErrorMessage from '../../components/core/Error';
import { LandingHeaderTitle } from '../../components/core/Text';
import { TextLink } from '../../components/core/Link';
import Loading from '../../components/core/Loading';
import GoogleLogin from '../../components/config/GoogleLogin';
import { onEnterAction } from '../../util/Utility';

function RegisterPage() {
  const history = useHistory();
  const { firebaseUser } = useAppSelector((state) => state.account);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAction = () => history.replace('/dashboard');

  // Redirect if logged in already
  useEffect(() => {
    app.auth().getRedirectResult()
      .then(() => {
        if (firebaseUser) redirectAction();
      }).catch((err) => {
        setError(err.message);
      });
  }, [firebaseUser]);

  const handleChange = (func: (val: string) => void, val: string) => {
    func(val);
    setError('');
  };

  const onSubmit = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please enter a value for each field.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    app.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (res.user) {
          res.user!.sendEmailVerification();
        }
        redirectAction();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <LandingHeaderTitle>
        Register an Account
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
        <AuthPasswordInput
          placeholder="Confirm Password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => handleChange(setConfirmPassword, e.target.value)}
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <TextLink to="/login">Or login to an existing account &#8594;</TextLink>
      </div>
      <div>
        <PrimaryButton onClick={onSubmit}>
          Register
        </PrimaryButton>
        <GoogleLogin successAction={redirectAction} errorAction={setError} />
      </div>

      {loading ? <Loading /> : null}
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}

export default RegisterPage;
