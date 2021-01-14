import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText } from '../core/Text';

type PlayerIconProps = {
  color: string,
};

const Content = styled.div`
  display: inline-block;
  margin: 10px;
`;

const PlayerIcon = styled.div<PlayerIconProps>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;
`;

const HoverBar = styled.div`
  // TODO: on hover, show numCorrect, last submission, etc.
`;

type LeaderboardCardProps = {
  player: Player,
  isCurrentPlayer: boolean,
  place: number,
  color: string,
};

function LeaderboardCard(props: LeaderboardCardProps) {
  const {
    place, player, isCurrentPlayer, color,
  } = props;
  const { nickname } = player.user;
  const shortenedNickname = nickname.length > 13 ? `${nickname.substring(0, 10)}...` : nickname;

  const displayName = `${shortenedNickname} ${isCurrentPlayer ? '(you)' : ''}`;
  const latestSubmission = player.submissions.slice(-1)[0];
  let status = '';
  if (!latestSubmission) {
    status = 'No attempts';
  } else {
    status = `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases}`;
  }

  return (
    <Content>
      <PlayerIcon color={color} />
      <LowMarginText>{`${place}. ${displayName}`}</LowMarginText>

      <HoverBar>
        {status}
      </HoverBar>
    </Content>
  );
}

export default LeaderboardCard;
