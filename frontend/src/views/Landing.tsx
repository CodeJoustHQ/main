import React, { useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { Image, ShadowImage } from '../components/core/Image';
import {
  MainHeaderText, LandingHeaderTitle, SecondaryHeaderText, LargeText,
} from '../components/core/Text';
import { ColumnContainer, RowContainer, Separator } from '../components/core/Container';
import { CopyIndicator, CopyIndicatorContainer, InlineCopyIcon } from '../components/special/CopyIndicator';
import { InheritedTextButton } from '../components/core/Button';

const CreateAccountButtonLink = styled(PrimaryButtonLink)`
  margin: 10px 0;
`;

const HeroTextContainer = styled.div`
  text-align: left;
  
  @media(max-width: 1000px) {
    text-align: center;
    margin-bottom: 40px;
  }
`;

const HeroText = styled(LandingHeaderTitle)`
  font-size: ${({ theme }) => theme.fontSize.epic};
  margin: 5px 0;
  line-height: 1.2;
  
  @media(max-width: 1450px) {
    font-size: ${({ theme }) => theme.fontSize.xxLarge};
  }
`;

const HeroSubtitleText = styled(MainHeaderText)`
  @media(max-width: 1450px) {
    font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  }
`;

const BackgroundCircleRow = styled(RowContainer)`
  background-image: url("/landing/background_circles.png");
  background-repeat: no-repeat;
  background-position: center;
  padding: 150px 30px;
  margin-bottom: 50px;
  
  @media(max-width: 1000px) {
    padding: 0;
    background-image: none;
  }
`;

const CallToActionColumn = styled(ColumnContainer)`
  flex: 0 0 60%;

  @media(max-width: 1000px) {
    width: 70%;
    margin: 0 auto;
  }
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
        <ColumnContainer width="40%">
          <HeroTextContainer>
            <HeroText>Coding practice made fun</HeroText>
            <HeroSubtitleText>
              Engage your students with real-time programming practice that they&apos;ll love
            </HeroSubtitleText>

            <CreateAccountButtonLink to="/register">
              Create an account
            </CreateAccountButtonLink>
            <br />
            <TextLink to="/game/create">
              Or demo a game &#8594;
            </TextLink>
          </HeroTextContainer>
        </ColumnContainer>
        <ColumnContainer width="60%">
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
        <ColumnContainer width="40%">
          <LargeText>
            Practice problems for all scenarios
          </LargeText>
          <SecondaryHeaderText>
            Browse through our large collection of problems covering everything from basic
            conditional logic to sets, maps, and dynamic programming. Or, if you can’t find
            what you&apos;re looking for, create your own set of unique problems.
          </SecondaryHeaderText>
        </ColumnContainer>
        <ColumnContainer width="60%">
          <Image src="/landing/problems.png" alt="Multiple example problem cards" />
        </ColumnContainer>
      </RowContainer>

      <Separator />
      <Separator />

      <RowContainer>
        <ColumnContainer width="90%">
          <LargeText>
            A clean interface for students and teachers alike
          </LargeText>
          <SecondaryHeaderText>
            Students can read the problem description, write code, and test their solution all
            on a single page. Meanwhile, as a teacher, you&apos;ll have a bird&apos;s-eye view
            of all of your students&apos; progress throughout the game.
          </SecondaryHeaderText>
          <br />
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
            game ends, you&apos;ll also be able to view detailed results about student
            submissions and code.
          </SecondaryHeaderText>
          <br />
          <Image src="/landing/results.png" alt="Example of the results shown" />
        </ColumnContainer>
      </RowContainer>

      <BackgroundCircleRow>
        <CallToActionColumn>
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
              <InlineCopyIcon>content_copy</InlineCopyIcon>
            </InheritedTextButton>
            {' '}
            for one-on-one support within 24 hours.
          </SecondaryHeaderText>

          <CreateAccountButtonLink to="/register">
            Create an account
          </CreateAccountButtonLink>
        </CallToActionColumn>
      </BackgroundCircleRow>
    </>
  );
}

export default LandingPage;
