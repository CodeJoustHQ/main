import React from 'react';
import styled from 'styled-components';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { Image, ShadowImage } from '../components/core/Image';
import {
  MainHeaderText, LandingHeaderTitle, SecondaryHeaderText, LargeText,
} from '../components/core/Text';
import {
  ColumnContainer, RowContainer, Separator, TextLeftContainer,
} from '../components/core/Container';

const CreateAccountButtonLink = styled(PrimaryButtonLink)`
  margin: 10px 0;
`;

const HeroText = styled(LandingHeaderTitle)`
  font-size: ${({ theme }) => theme.fontSize.xxxLarge};
  margin: 5px 0;
  line-height: 1.2;
`;

function LandingPage() {
  return (
    <>
      <RowContainer>
        <ColumnContainer width="400px">
          <TextLeftContainer>
            <HeroText>Group coding made fun</HeroText>
            <MainHeaderText>
              Engage your students with real-time programming practice that they&apos;ll enjoy
            </MainHeaderText>

            <CreateAccountButtonLink to="/register">
              Create an account
            </CreateAccountButtonLink>
            <br />
            <TextLink to="/game/join">
              Or demo a game &#8594;
            </TextLink>
          </TextLeftContainer>
        </ColumnContainer>
        <ColumnContainer width="600px">
          <ShadowImage src="/landing/game.png" alt="Image of game page" />
        </ColumnContainer>
      </RowContainer>

      <Separator />
      <Separator />

      <RowContainer>
        <ColumnContainer width="80%">
          <LargeText>
            Invite the class to an energetic coding session
          </LargeText>
          <SecondaryHeaderText>
            Creating and inviting students to a room is as quick as 1-2-3. You’ll have full
            control over the room settings including duration, problems, participants, and
            more. Once everyone has joined, start playing!
          </SecondaryHeaderText>
          <br />
          <ShadowImage src="/landing/lobby.png" alt="Image of lobby page" />
        </ColumnContainer>
      </RowContainer>
    </>
  );
}

export default LandingPage;
