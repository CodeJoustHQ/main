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
  
  //height: 50px;
  padding: 10px;
  
  // -(height + 2 * padding - 15px)
  margin-top: -55px;
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

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    const maxLength = isCurrentPlayer ? 5 : 9;

    const shortenedNickname = (nickname.length > maxLength) ? `${nickname.substring(0, maxLength - 3)}...` : nickname;
    return `${shortenedNickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getScoreDisplay = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return '0 correct';
    }
    return `${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
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
      <PlayerIcon
        hexColor={color.hexColor}
        active={Boolean(player.user.sessionId || isCurrentPlayer)}
      />
      <LowMarginText>{`${place}. ${getDisplayNickname()}`}</LowMarginText>

      {showHover ? (
        <HoverBar>
          <SmallText>{getScoreDisplay()}</SmallText>
          <SmallText>{`Last submitted: ${getSubmissionTime()}`}</SmallText>
          {!player.user.sessionId ? <SmallText>(inactive)</SmallText> : null}
        </HoverBar>
      ) : null}
    </Content>
  );
}

export default LeaderboardCard;
