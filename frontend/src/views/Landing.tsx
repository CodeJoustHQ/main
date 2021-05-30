import React from 'react';
import styled from 'styled-components';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { Image } from '../components/core/Image';
import { MainHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { ColumnContainer, RowContainer, TextLeftContainer } from '../components/core/Container';

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
        <ColumnContainer width="40%">
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
        <ColumnContainer width="60%">
          <Image width="100%" src="/landing/game.png" alt="Image of game page" />
        </ColumnContainer>
      </RowContainer>
    </>
  );
}

export default LandingPage;
