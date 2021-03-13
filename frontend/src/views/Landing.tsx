import React from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText, LandingHeaderTitle } from '../components/core/Text';

function LandingPage() {
  return (
    <>
      <LandingHeaderTitle>
        CodeJoust
      </LandingHeaderTitle>
      <LandingHeaderText>
        Compete live against friends and classmates to solve coding challenges.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/create">
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
