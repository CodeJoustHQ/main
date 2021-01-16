import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { MediumText, Text } from '../core/Text';

const Content = styled.div`
  display: block;
  margin: 10px;
`;

type PlayerResultsCardProps = {
  player: Player,
  place: number,
};

function PlayerResultsCard(props: PlayerResultsCardProps) {
  const { player, place } = props;

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
    // TODO 
  };

  const getScoreDisplay = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return '0 correct';
    }
    return `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;

    // TODO
  };

  const getSubmissionTime = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return 'Never';
    }

    const diffMilliseconds = Date.now() - new Date(latestSubmission.startTime).getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));
    return `${diffMinutes} min ago`;

    // TODO
  };

  return (
    <Content>
      <MediumText>{`${place}. ${player.user.nickname}`}</MediumText>
      <Text>{status}</Text>
    </Content>
  );
}

export default PlayerResultsCard;
