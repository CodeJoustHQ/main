import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player, Submission } from '../../api/Game';
import { SmallerMediumText, MediumText } from '../core/Text';
import Language, { displayNameFromLanguage } from '../../api/Language';

type PodiumProps = {
  place: number,
  player: Player | undefined,
  gameStartTime: string,
};

type MedalProps = {
  color: string,
};

const PodiumContainer = styled.div`
  position: relative;
  display: inline-block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  width: 220px;
  height: 340px;
  padding: 10px;
  margin: 10px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;

const ScoreText = styled(MediumText)`
  font-weight: normal;
  margin: 0;
`;

const BottomContent = styled.div`
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Medal = styled.div<MedalProps>`
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  border-radius: 50%;
  margin: 15px auto;
  
  height: 50px;
  width: 50px;  
  line-height: 50px;
`;

function Podium(props: PodiumProps) {
  const { place, player, gameStartTime } = props;

  const [bestSubmission, setBestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (player) {
      // Find best submission
      player.submissions.forEach((submission) => {
        if (!bestSubmission || submission.numCorrect > bestSubmission.numCorrect) {
          setBestSubmission(submission);
        }
      });
    }
  }, [player, setBestSubmission]);

  const getScoreText = () => {
    if (!bestSubmission) {
      return <p />;
    }

    const percent = Math.round((bestSubmission.numCorrect / bestSubmission.numTestCases) * 100);
    return (
      <ScoreText>
        Scored
        <b>{` ${percent}%`}</b>
      </ScoreText>
    );
  };

  const getTimeText = () => {
    if (!bestSubmission) {
      return <p />;
    }

    // Calculate time from start of game till best submission
    const startTime = new Date(gameStartTime).getTime();
    const diffMilliseconds = new Date(bestSubmission.startTime).getTime() - startTime;
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));

    return (
      <SmallerMediumText>
        in
        <b>{` ${diffMinutes} minutes`}</b>
      </SmallerMediumText>
    );
  };

  const getLanguageText = () => {
    if (!bestSubmission) {
      return <p />;
    }
    // console.log(bestSubmission);
    // console.log(fromString(bestSubmission.language));
    // console.log(bestSubmission.language as Language);
    // debugger;
    return (
      <SmallerMediumText>
        Language:
        <b>{` ${displayNameFromLanguage(bestSubmission.language as Language)}`}</b>
      </SmallerMediumText>
    );
  };

  return (
    <PodiumContainer>
      <Medal color="yellow" />
      {getScoreText()}
      {getTimeText()}

      <BottomContent>
        {getLanguageText()}
      </BottomContent>
    </PodiumContainer>
  );
}

export default Podium;
