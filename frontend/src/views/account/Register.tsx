import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import app from '../../api/Firebase';
import { useAppSelector } from '../../util/Hook';
import { TextInput } from '../../components/core/Input';
import { PrimaryButton } from '../../components/core/Button';
import ErrorMessage from '../../components/core/Error';
import { LandingHeaderTitle } from '../../components/core/Text';
import { TextLink } from '../../components/core/Link';
import Loading from '../../components/core/Loading';
import GoogleLogin from '../../components/config/GoogleLogin';
import { onEnterAction } from '../../util/Utility';

const RegisterInput = styled(TextInput)`
  display: block;
  margin: 15px auto;
  width: 20rem;
`;

function RegisterPage() {
  const history = useHistory();
  const { firebaseUser } = useAppSelector((state) => state.account);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAction = () => history.replace('/dashboard');

  if (firebaseUser) {
    redirectAction();
  }

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
        <RegisterInput
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => handleChange(setEmail, e.target.value)}
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <RegisterInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => handleChange(setPassword, e.target.value)}
          onKeyPress={(e) => onEnterAction(onSubmit, e)}
        />
        <RegisterInput
          placeholder="Confirm Password"
          name="confirm-password"
          type="password"
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
