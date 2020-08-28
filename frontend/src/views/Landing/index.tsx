import React from 'react';
import styled from 'styled-components';
import { PrimaryLink, TextLink } from '../../components/controls/Link';

const Content = styled.div`
  width: 80%;
  padding: 20% 10%;
`;

function LandingPage() {
  return (
    <div>
      <Content>
        <PrimaryLink to="/game/join" width="400px">
          Join a Game
        </PrimaryLink>
        <br />
        <TextLink to="/game/join">
          Or create a room
        </TextLink>
      </Content>
    </div>
  );
}

export default LandingPage;
