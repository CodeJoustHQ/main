import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, SmallText } from '../core/Text';
import PlayerIcon from './PlayerIcon';
import { Color } from '../../api/Color';

const Content = styled.div`
  display: inline-block;
  position: relative;
  margin: 10px;
  width: 7rem;
  
  &:hover {
    cursor: pointer;
  }
`;

const HoverBar = styled.div`
  // Center div above parent
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  
  width: 160px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  
  padding: 10px;
  margin-top: -40px;
`;

type LeaderboardCardProps = {
  player: Player,
  isCurrentPlayer: boolean,
  place: number,
  color: Color,
};

function LeaderboardCard(props: LeaderboardCardProps) {
  const {
    place, player, isCurrentPlayer, color,
  } = props;

  const [showHover, setShowHover] = useState(false);

  const getScoreDisplay = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return '0 correct';
    }
    return `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
  };

  const getScorePercentage = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return '';
    }

    return ` ${Math.round((latestSubmission.numCorrect / latestSubmission.numTestCases) * 100)}%`;
  };

  const getSubmissionTime = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return 'Never';
    }

    const currentTime = new Date().getTime();
    const diffMilliseconds = currentTime - new Date(latestSubmission.startTime).getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));
    return `${diffMinutes} min ago`;
  };

  return (
    <Content
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <PlayerIcon gradientColor={color.gradientColor} nickname={player.user.nickname} />
      <LowMarginText bold={player.solved}>{`${place}.${getScorePercentage()}`}</LowMarginText>

      {showHover ? (
        <HoverBar>
          <SmallText>{`${player.user.nickname} ${isCurrentPlayer && ' (you)'}`}</SmallText>
          <SmallText>{getScoreDisplay()}</SmallText>
          <SmallText>{`Last submitted: ${getSubmissionTime()}`}</SmallText>
        </HoverBar>
      ) : null}
    </Content>
  );
}

export default LeaderboardCard;
