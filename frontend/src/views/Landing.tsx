import React from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { MainHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { useAppSelector } from '../util/Hook';
import DashboardPage from './account/Dashboard';

function LandingPage() {
  const { firebaseUser } = useAppSelector((state) => state.account);

  if (firebaseUser) {
    return <DashboardPage />;
  }

  return (
    <>
      <LandingHeaderTitle>
        CodeJoust
      </LandingHeaderTitle>
      <MainHeaderText>
        Compete live against friends and classmates to solve coding challenges.
      </MainHeaderText>
      <PrimaryButtonLink
        width="12rem"
        height="3.25rem"
        to="/game/create"
      >
        Create a room
      </PrimaryButtonLink>
      <br />
      <TextLink to="/game/join">
        Or join an existing room &#8594;
      </TextLink>
    </>
  );
}

export default LandingPage;
