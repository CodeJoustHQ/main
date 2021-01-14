import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';

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
  // Center div above parent
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  
  width: 150px;
  background-color: ${({ theme }) => theme.colors.white};
  //border-radius: 5px 5px 0 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  
  height: 40px;
  padding: 10px;
  
  // -(height + 2 * padding - 3px)
  //margin-top: -36px;
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

  // TODO: clean up in method
  const { nickname } = player.user;
  const shortenedNickname = nickname.length > 13 ? `${nickname.substring(0, 10)}...` : nickname;

  const displayName = `${shortenedNickname} ${isCurrentPlayer ? '(you)' : ''}`;
  const latestSubmission = player.submissions.slice(-1)[0];
  const latestSubmissionTime = Math.abs(new Date() - latestSubmission.startTime) / 1000;
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
        <Text>{status}</Text>
        <Text>{`Last submitted: ${latestSubmissionTime}s ago`}</Text>
      </HoverBar>
    </Content>
  );
}

export default LeaderboardCard;
