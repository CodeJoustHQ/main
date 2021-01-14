import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText } from '../core/Text';

const Content = styled.div`
  display: inline-block;
  margin: 10px;
`;

const PlayerIcon = styled.div`
  // TODO: change to inputted color
  background-color: ${({ theme }) => theme.colors.blue};
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
};

function LeaderboardCard(props: LeaderboardCardProps) {
  const { player, isCurrentPlayer } = props;
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
      <PlayerIcon />
      <LowMarginText>{displayName}</LowMarginText>

      <HoverBar>
        {status}
      </HoverBar>
    </Content>
  );
}

export default LeaderboardCard;
