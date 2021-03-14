import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, SmallText } from '../core/Text';
import PlayerIcon from './PlayerIcon';
import { Color } from '../../api/Color';

type ContentStyleType = {
  isCurrentPlayer: boolean,
}

const Content = styled.div<ContentStyleType>`
  display: inline-block;
  position: relative;
  margin: 10px 5px;
  width: 60px;
  height: 80px;
  padding: 10px 10px 5px 10px;
  
  &:hover {
    cursor: pointer;
  }
  
  ${({ theme, isCurrentPlayer }) => isCurrentPlayer && `
    border-radius: 5px;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.12);
    background: ${theme.colors.white};
  `};
`;

const CenteredScrollableContent = styled.div`
  text-align: center;
  overflow-x: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const HoverBar = styled.div`
  // Center div over parent
  position: absolute;
  z-index: 5;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  
  // width+padding, height+padding must match that of Content to perfect overlap
  width: 70px;
  min-height: 85px;
  padding: 5px;
  
  text-align: left;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
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
      return '0';
    }
    return `${latestSubmission.numCorrect}/${latestSubmission.numTestCases}`;
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
    return `${diffMinutes}m ago`;
  };

  return (
    <Content
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      isCurrentPlayer={isCurrentPlayer}
    >
      <PlayerIcon
        gradientColor={color.gradientColor}
        nickname={player.user.nickname}
        active={Boolean(player.user.sessionId)}
      />
      <LowMarginText bold={player.solved}>{`${place}.${getScorePercentage()}`}</LowMarginText>

      {showHover ? (
        <HoverBar>
          <CenteredScrollableContent>
            <SmallText bold>{player.user.nickname}</SmallText>
          </CenteredScrollableContent>
          <SmallText>{`Score: ${getScoreDisplay()}`}</SmallText>
          <SmallText>{`Last: ${getSubmissionTime()}`}</SmallText>
        </HoverBar>
      ) : null}
    </Content>
  );
}

export default LeaderboardCard;
