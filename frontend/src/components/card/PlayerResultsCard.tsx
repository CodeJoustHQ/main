import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import PlayerIcon from './PlayerIcon';
import {
  CenteredContainer, FlexHorizontalContainer, FlexLeft, FlexRight,
} from '../core/Container';
import { Color } from '../../api/Color';

const Content = styled.div`
  display: block;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
`;

type PlayerResultsCardProps = {
  player: Player,
  place: number,
  isCurrentPlayer: boolean,
  color: Color,
};

function PlayerResultsCard(props: PlayerResultsCardProps) {
  const {
    player, place, isCurrentPlayer, color,
  } = props;

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getScoreDisplay = () => {
    const latestSubmission = player.submissions.slice(-1)[0];
    if (!latestSubmission) {
      return 'Final Score: 0 correct';
    }
    return `Final Score: ${latestSubmission.numCorrect} / ${latestSubmission.numTestCases} correct`;
  };

  const getSubmissionCount = () => `Submissions: ${player.submissions.length}`;

  return (
    <Content>
      <FlexHorizontalContainer>
        <FlexLeft>
          <CenteredContainer>
            <PlayerIcon
              hexColor={color.hexColor}
              active={Boolean(player.user.sessionId || isCurrentPlayer)}
            />
            <br />
            <LowMarginText>{`${place}. ${getDisplayNickname()}`}</LowMarginText>
          </CenteredContainer>
        </FlexLeft>

        <FlexRight>
          <CenteredContainer>
            <Text>{getScoreDisplay()}</Text>
            <br />
            <Text>{getSubmissionCount()}</Text>
          </CenteredContainer>
        </FlexRight>
      </FlexHorizontalContainer>
    </Content>
  );
}

export default PlayerResultsCard;
