import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { MediumText, Text } from '../core/Text';

const Content = styled.div`
  display: block;
  margin: 10px;
  
  // TODO: potentially flex
`;

type PlayerResultsCardProps = {
  player: Player,
  place: number,
  isCurrentPlayer: boolean,
};

function PlayerResultsCard(props: PlayerResultsCardProps) {
  const { player, place, isCurrentPlayer } = props;

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getScoreDisplay = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return 'Final Score: 0 correct';
    }
    return `Final Score: ${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
  };

  const getSubmissionCount = () => player.submissions.length;

  return (
    <Content>
      <MediumText>{`${place}. ${getDisplayNickname()}`}</MediumText>
      <Text>{getScoreDisplay()}</Text>
      <Text>{getSubmissionCount()}</Text>
    </Content>
  );
}

export default PlayerResultsCard;
