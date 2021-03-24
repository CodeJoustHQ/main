import React from 'react';
import { ThemeConfig } from '../components/config/Theme';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { MainHeaderText, LandingHeaderTitle } from '../components/core/Text';

function LandingPage() {
  return (
    <>
      <LandingHeaderTitle>
        CodeJoust
      </LandingHeaderTitle>
      <MainHeaderText>
        Compete live against friends and classmates to solve coding challenges.
      </MainHeaderText>
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
