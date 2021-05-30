import React from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { MainHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { ColumnContainer, LeftContainer, RowContainer } from '../components/core/Container';

function LandingPage() {
  return (
    <>
      <RowContainer>
        <ColumnContainer>
          <LeftContainer>
            <LandingHeaderTitle>Group coding made fun</LandingHeaderTitle>
            <MainHeaderText>
              Engage your students with real-time programming practice that they&apos;ll enjoy
            </MainHeaderText>

            <PrimaryButtonLink to="/register">
              Create an account
            </PrimaryButtonLink>
            <br />
            <TextLink to="/game/join">
              Or demo a game &#8594;
            </TextLink>
          </LeftContainer>
        </ColumnContainer>
        <ColumnContainer>
          <img width="100%" src="/landing/game.png" alt="Image of game page" />
        </ColumnContainer>
      </RowContainer>
    </>
  );
}

export default LandingPage;
