import React, { useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { Image, ShadowImage } from '../components/core/Image';
import {
  MainHeaderText, LandingHeaderTitle, SecondaryHeaderText, LargeText,
} from '../components/core/Text';
import {
  ColumnContainer, RowContainer, Separator, TextLeftContainer,
} from '../components/core/Container';
import { CopyIndicator, CopyIndicatorContainer, InheritedCopyIcon } from '../components/special/CopyIndicator';
import { InheritedTextButton } from '../components/core/Button';

const CreateAccountButtonLink = styled(PrimaryButtonLink)`
  margin: 10px 0;
`;

const HeroText = styled(LandingHeaderTitle)`
  font-size: ${({ theme }) => theme.fontSize.xxxLarge};
  margin: 5px 0;
  line-height: 1.2;
`;

const BackgroundCircleRow = styled.div`
  background-image: url("/landing/background_circles.png");
  background-repeat: no-repeat;
  background-position: center;
  padding: 150px 200px;
`;

function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  return (
    <>
      <CopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Link copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>

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
        <ColumnContainer width="90%">
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

      <Separator />
      <Separator />

      <RowContainer>
        <ColumnContainer width="400px">
          <LargeText>
            Practice problems for all scenarios
          </LargeText>
          <SecondaryHeaderText>
            Browse through our large collection of problems covering everything from basic
            conditional logic to sets, maps, and dynamic programming. Or, if you can’t find
            what you&apos;re looking for, create your own set of unique problems.
          </SecondaryHeaderText>
        </ColumnContainer>
        <ColumnContainer width="600px">
          <Image src="/landing/problems.png" alt="Multiple example problem cards" />
        </ColumnContainer>
      </RowContainer>

      <Separator />
      <Separator />

      <RowContainer>
        <ColumnContainer width="80%">
          <LargeText>
            A clean interface for students and teachers alike
          </LargeText>
          <SecondaryHeaderText>
            Students can read the problem description, write code, and test their solution all
            on a single page. Meanwhile, as a teacher, you&apos;ll have a bird&apos;s-eye view
            of all of your students&apos; progress throughout the game.
          </SecondaryHeaderText>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <ShadowImage src="/landing/game_abstract.png" alt="Abstract design of game page" />
        </ColumnContainer>
        <ColumnContainer>
          <ShadowImage src="/landing/admin_abstract.png" alt="Abstract design of admin page" />
        </ColumnContainer>
      </RowContainer>

      <Separator />
      <Separator />

      <RowContainer>
        <ColumnContainer width="90%">
          <LargeText>
            Celebrate top performers and view detailed results
          </LargeText>
          <SecondaryHeaderText>
            Motivate students to do well by competing for a spot on the coveted podium. Once the
            game ends, you&apos;ll also be able to view detailed results about students&apos;
            submissions and code.
          </SecondaryHeaderText>
          <br />
          <Image src="/landing/results.png" alt="Example of the results shown" />
        </ColumnContainer>
      </RowContainer>

      <BackgroundCircleRow>
        <ColumnContainer width="600px">
          <LargeText>
            Want to try out CodeJoust in your classroom?
          </LargeText>
          <SecondaryHeaderText>
            Create an account now or email us at
            {' '}
            <InheritedTextButton
              onClick={() => {
                copy('hello@codejoust.co');
                setCopiedEmail(true);
              }}
            >
              hello@codejoust.co
              <InheritedCopyIcon>content_copy</InheritedCopyIcon>
            </InheritedTextButton>
            {' '}
            for one-on-one support within 24 hours.
          </SecondaryHeaderText>

          <CreateAccountButtonLink to="/register">
            Create an account
          </CreateAccountButtonLink>
        </ColumnContainer>
      </BackgroundCircleRow>
    </>
  );
}

export default LandingPage;
