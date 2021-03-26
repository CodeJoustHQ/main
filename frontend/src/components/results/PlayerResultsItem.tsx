import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import { Color } from '../../api/Color';
import { useBestSubmission } from '../../util/Hook';
import Language, { displayNameFromLanguage } from '../../api/Language';

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

const PlaceContent = styled.td`
  width: 70px;
`;

export const CircleIcon = styled.div<CircleParams>`
  display: inline-block;
  border-radius: 50%;
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  margin: 0 10px 0 0;
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
`;

type CircleParams = {
  color: string,
};

type PlayerResultsCardProps = {
  player: Player,
  place: number,
  isCurrentPlayer: boolean,
  gameStartTime: string,
  color: Color,
};

function PlayerResultsItem(props: PlayerResultsCardProps) {
  const {
    player, place, isCurrentPlayer, color, gameStartTime,
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
    if (!bestSubmission) {
      return 'None';
    }

    // Calculate time from start of game till best submission
    const startTime = new Date(gameStartTime).getTime();
    const diffMilliseconds = new Date(bestSubmission.startTime).getTime() - startTime;
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));

    return ` ${diffMinutes} min`;
  };

  const getSubmissionCount = () => player.submissions.length || '0';

  const getSubmissionCode = () => {
    if (!bestSubmission) {
      return 'N/A';
    }

    return displayNameFromLanguage(bestSubmission.language as Language);
  };

  return (
    <Content>
      <PlaceContent>
        <PlayerText bold>{`${place}. `}</PlayerText>
      </PlaceContent>

      <PlayerContent>
        <FlexCenter>
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
