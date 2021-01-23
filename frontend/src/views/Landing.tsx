import React from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';

function LandingPage() {
  console.log(Date.now());
  console.log(new Date());
  return (
    <div>
      <LandingHeaderText>
        Practice coding by competing against your friends.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/join">
        Join a Game
      </PrimaryButtonLink>
      <br />
      <TextLink to="/game/create">
        Or create a room &#8594;
      </TextLink>
    </div>
  );
}

export default LandingPage;
