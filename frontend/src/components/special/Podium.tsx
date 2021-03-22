import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player, Submission } from '../../api/Game';
import { MediumText, SmallerMediumText } from '../core/Text';
import Language from '../../api/Language';

type PodiumProps = {
  place: number,
  player: Player | undefined,
  gameStartTime: string,
};

type MedalProps = {
  color: string,
};

const PodiumContainer = styled.div`
  display: block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  width: 300px;
  height: 500px;
  padding: 10px;
  margin: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;

const BottomContent = styled.div`
  position: absolute;
  bottom: 5px;
  left: 50%;
`;

const Medal = styled.div<MedalProps>`
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  border-radius: 50%;
  margin: 0 auto;
  
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
      return '';
    }

    const percent = Math.round((bestSubmission.numCorrect / bestSubmission.numTestCases) * 100);
    return `Scored <b>${percent}%</b>`;
  };

  const getTimeText = () => {
    if (!bestSubmission) {
      return '';
    }

    // Calculate time from start of game till best submission
    const startTime = new Date(gameStartTime).getTime();
    const diffMilliseconds = new Date(bestSubmission.startTime).getTime() - startTime;
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));

    return `in <b>${diffMinutes} minutes</b>`;
  };

  const getLanguageText = () => {
    if (!bestSubmission) {
      return '';
    }

    return `Language: <b>${bestSubmission.language as Language}</b>`;
  };

  return (
    <PodiumContainer>
      <Medal color="yellow" />
      <MediumText>{getScoreText()}</MediumText>
      <SmallerMediumText>{getTimeText()}</SmallerMediumText>

      <BottomContent>
        <SmallerMediumText>{getLanguageText()}</SmallerMediumText>
      </BottomContent>
    </PodiumContainer>
  );
}

export default Podium;
