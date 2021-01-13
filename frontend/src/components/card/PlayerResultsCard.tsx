import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';

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

  return (
    <Content>
      {place}
      .
      {player.user.nickname}
    </Content>
  );
}

export default PlayerResultsCard;
