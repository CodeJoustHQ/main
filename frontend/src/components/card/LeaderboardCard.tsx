import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, SmallText } from '../core/Text';

type PlayerIconProps = {
  color: string,
};

const Content = styled.div`
  display: inline-block;
  position: relative;
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
  
  width: 160px;
  background-color: ${({ theme }) => theme.colors.white};
  //border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  
  height: 60px;
  padding: 10px;
  
  // -(height + 2 * padding - 3px)
  margin-top: -77px;
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

  const [showHover, setShowHover] = useState(false);

  // TODO: clean up in method
  const { nickname } = player.user;
  const shortenedNickname = nickname.length > 13 ? `${nickname.substring(0, 10)}...` : nickname;

  const displayName = `${shortenedNickname} ${isCurrentPlayer ? '(you)' : ''}`;
  const latestSubmission = player.submissions.slice(-1)[0];

  let latestSubmissionTime = '';
  let status = '';
  if (!latestSubmission) {
    status = 'No attempts';
    latestSubmissionTime = 'Never';
  } else {
    status = `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
    latestSubmissionTime = `${Math.floor(Math.abs(Date.now() - new Date(latestSubmission.startTime).getTime()) / (60 * 1000))}m ago`;
  }

  return (
    <Content
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <PlayerIcon color={color} />
      <LowMarginText>{`${place}. ${displayName}`}</LowMarginText>

      {showHover ? (
        <HoverBar>
          <SmallText>{status}</SmallText>
          <SmallText>{`Last submitted: ${latestSubmissionTime}`}</SmallText>
        </HoverBar>
      ) : null}
    </Content>
  );
}

export default LeaderboardCard;
