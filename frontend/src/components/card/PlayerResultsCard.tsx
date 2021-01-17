import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import PlayerIcon from './PlayerIcon';
import {FlexContainer, FlexLeft, FlexRight} from '../core/Container';

const Content = styled.div`
  display: block;
  margin: 10px;
`;

type PlayerResultsCardProps = {
  player: Player,
  place: number,
  isCurrentPlayer: boolean,
  color: string,
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

  const getSubmissionCount = () => player.submissions.length;

  return (
    <Content>
      <FlexContainer>
        <FlexLeft>
          <PlayerIcon color={color} />
          <LowMarginText>{`${place}. ${getDisplayNickname()}`}</LowMarginText>
        </FlexLeft>

        <FlexRight>
          <Text>{getScoreDisplay()}</Text>
          <Text>{getSubmissionCount()}</Text>
        </FlexRight>
      </FlexContainer>
    </Content>
  );
}

export default PlayerResultsCard;
