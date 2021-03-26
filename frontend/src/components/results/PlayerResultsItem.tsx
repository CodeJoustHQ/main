import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import { Color } from '../../api/Color';
import { useBestSubmission } from '../../util/Hook';

const Content = styled.tr`
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
`;

const PlayerContent = styled.td`
  height: 40px;
  line-height: 40px;
  text-align: left;
`;

export const CircleIcon = styled.div<CircleParams>`
  display: inline-block;
  border-radius: 50%;
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  margin: 0 10px 0 20px;
  width: 24px;
  height: 24px;
`;

const PlayerText = styled(LowMarginText)`
  display: inline-block;
`;

const FlexCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0 20px;
`;

type CircleParams = {
  color: string,
};

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

  const bestSubmission = useBestSubmission(player);

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getScore = () => {
    if (!bestSubmission) {
      return '0';
    }

    const percent = Math.round((bestSubmission.numCorrect / bestSubmission.numTestCases) * 100);
    return `${percent}%`;
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
        <FlexCenter>
          <PlayerText bold>{`${place}. `}</PlayerText>
          <CircleIcon color={color.gradientColor} />
          <PlayerText bold={isCurrentPlayer}>{getDisplayNickname()}</PlayerText>
        </FlexCenter>
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
