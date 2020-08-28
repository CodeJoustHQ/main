import React from 'react';
import styled from 'styled-components';
import { PrimaryButtonLink, TextLink } from '../../components/core/Link';
import { LandingHeaderText } from '../../components/core/Text';

const Content = styled.div`
  margin: 0 auto;
  width: 60%;
  padding: 10% 20%;
`;

function LandingPage() {
  return (
    <div>
      <Content>
        <LandingHeaderText>
          Practice coding by competing against your friends.
        </LandingHeaderText>
        <PrimaryButtonLink to="/game/join" width="400px">
          Join a Game
        </PrimaryButtonLink>
        <br />
        <TextLink to="/game/join">
          Or create a room
        </TextLink>
      </Content>
    </div>
  );
}

export default LandingPage;
