import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { Text } from '../core/Text';

const Content = styled.div`
  display: inline-block;
  margin: 10px;
`;

const PlayerIcon = styled.div`
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50%;
`;

type LeaderboardCardProps = {
  player: Player,
  isCurrentPlayer: boolean,
};

function LeaderboardCard(props: LeaderboardCardProps) {
  const { player, isCurrentPlayer } = props;

  const name = `${player.user.nickname.charAt(0).toUpperCase()} ${isCurrentPlayer ? '(you)' : ''}`;
  const latestSubmission = player.submissions.slice(-1)[0];
  let status = '';
  if (!latestSubmission) {
    status = 'No attempts';
  } else {
    status = `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases}`;
  }

  return (
    <Content>
      <PlayerIcon>
        <Text>{name}</Text>
      </PlayerIcon>

      <Text>
        {status}
      </Text>
    </Content>
  );
}

export default LeaderboardCard;
