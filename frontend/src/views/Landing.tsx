import React from 'react';
import { ThemeConfig } from '../components/config/Theme';
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
      <PrimaryButtonLink
        color={ThemeConfig.colors.gradients.blue}
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
