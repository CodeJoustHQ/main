import React from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import app from '../../api/Firebase';
import { PrimaryButton } from '../core/Button';

const GoogleButton = styled(PrimaryButton)`
  position: relative;
  display: block;
  margin: 10px auto;
  background: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const GoogleImage = styled.img`
  position: absolute;
  left: 15px;
  width: 30px;
`;

const GoogleText = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

type GoogleLoginProps = {
  successAction: () => void,
  errorAction: (err: string) => void,
};

function GoogleLogin(props: GoogleLoginProps) {
  const { successAction, errorAction } = props;

  const onGoogleSubmit = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    app.auth()
      .signInWithRedirect(provider)
      .then(() => successAction())
      .catch((err) => errorAction(err.message));
  };

  return (
    <GoogleButton type="button" className="login-provider-button" onClick={onGoogleSubmit}>
      <GoogleImage src="https://img.icons8.com/fluent/48/000000/google-logo.png" />
      <GoogleText> Google</GoogleText>
    </GoogleButton>
  );
}

export default GoogleLogin;
