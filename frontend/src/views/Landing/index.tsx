import React from 'react';
import { PrimaryButtonLink, TextLink } from '../../components/core/Link';
import { LandingHeaderText } from '../../components/core/Text';

function LandingPage() {
  return (
    <div>
      <LandingHeaderText>
        Practice coding by competing against your friends.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/join" width="400px">
        Join a Game
      </PrimaryButtonLink>
      <br />
      <TextLink to="/game/join">
        Or create a room &#8594;
      </TextLink>
    </div>
  );
}

export default LandingPage;
