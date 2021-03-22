import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player, Submission } from '../../api/Game';
import { MediumText, SmallerMediumText } from '../core/Text';

type PodiumProps = {
  place: string,
  player?: Player,
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

  return (
    <PodiumContainer>
      <Medal color="yellow" />
      <MediumText>{getScoreText()}</MediumText>
      <SmallerMediumText>{getTimeText()}</SmallerMediumText>
      Score
      Time
      Language
    </PodiumContainer>
  );
}

export default Podium;
