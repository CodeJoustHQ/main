import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { NoMarginSmallText } from '../core/Text';

const Content = styled.div`
  display: inline-block;
  margin: 10px;
`;

const PlayerIcon = styled.div`
  // TODO: change to inputted color
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50%;
  
  height: 50px;
  line-height: 50px;
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

  const name = `${player.user.nickname} ${isCurrentPlayer ? '(you)' : ''}`;
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
      <NoMarginSmallText>{name}</NoMarginSmallText>

      <HoverBar>
        {status}
      </HoverBar>
    </Content>
  );
}

export default LeaderboardCard;
