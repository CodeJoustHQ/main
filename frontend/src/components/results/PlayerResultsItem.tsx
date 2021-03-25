import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import PlayerIcon from '../card/PlayerIcon';
import { Color } from '../../api/Color';

const Content = styled.tr`
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
`;

const PlayerContent = styled.td`
  
`;

type PlayerResultsCardProps = {
  player: Player,
  place: number,
  isCurrentPlayer: boolean,
  color: Color,
};

function PlayerResultsItem(props: PlayerResultsCardProps) {
  const {
    player, place, isCurrentPlayer, color,
  } = props;

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getScore = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return 'Final Score: 0 correct';
    }
    return `Final Score: ${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
  };

  const getSubmissionTime = () => {
    return '0';
  };

  const getSubmissionCount = () => `Submissions: ${player.submissions.length}`;

  const getSubmissionCode = () => {
    return 'Python';
  };

  return (
    <Content>
      <PlayerContent>
        <LowMarginText bold>{`${place}. `}</LowMarginText>
        <PlayerIcon
          gradientColor={color.gradientColor}
          nickname={player.user.nickname}
          active={Boolean(player.user.sessionId)}
        />
        <br />
        <LowMarginText>{getDisplayNickname()}</LowMarginText>
      </PlayerContent>

      <td>
        <Text>{getScore()}</Text>
      </td>
      <td>
        <Text>{getSubmissionTime()}</Text>
      </td>
      <td>
        <Text>{getSubmissionCount()}</Text>
      </td>
      <td>
        <Text>{getSubmissionCode()}</Text>
      </td>
    </Content>
  );
}

export default PlayerResultsItem;
