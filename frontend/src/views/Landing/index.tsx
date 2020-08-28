import React from 'react';
import styled from 'styled-components';
import { PrimaryButtonLink, TextLink } from '../../components/controls/Link';

const Content = styled.div`
  width: 80%;
  padding: 20% 10%;
`;

function LandingPage() {
  return (
    <div>
      <Content>
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
