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

  return (
    <Content>
      <PlayerIcon>
        <Text>{player.user.nickname}</Text>
        <Text>{isCurrentPlayer ? ' (you)' : ''}</Text>
      </PlayerIcon>

      <Text>
        Solved:
        {player.solved}
      </Text>
    </Content>
  );
}

export default LeaderboardCard;
