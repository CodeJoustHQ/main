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

  const latestSubmission = player.submissions.slice(-1)[0];
  let status = '';
  if (!latestSubmission) {
    status = 'No attempts';
  } else {
    status = `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases}`;
    // TODO: include time and color
  }

  return (
    <Content>
      <MediumText>{`${place}. ${player.user.nickname}`}</MediumText>
      <Text>{status}</Text>
    </Content>
  );
}

export default PlayerResultsCard;
