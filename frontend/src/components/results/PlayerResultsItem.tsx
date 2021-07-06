import React from 'react';
import styled from 'styled-components';
import { Player, Submission } from '../../api/Game';
import { LowMarginText, Text } from '../core/Text';
import { Color } from '../../api/Color';
import { useBestSubmission, useGetScore, useGetSubmissionTime } from '../../util/Hook';
import Language, { displayNameFromLanguage } from '../../api/Language';
import { TextButton } from '../core/Button';

const Content = styled.tr`
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  
  td {
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const PlayerContent = styled.td`
  height: 40px;
  line-height: 40px;
  text-align: left;
`;

const PlaceColumn = styled.td`
  width: 70px;
`;

const CodeColumn = styled.td`
  width: 140px;
`;

const CircleIcon = styled.div<CircleParams>`
  display: inline-block;
  border-radius: 50%;
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  margin: 0 10px 0 0;
  width: 24px;
  height: 24px;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const PreviewIcon = styled.i`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin-left: 5px;
`;

const PlayerText = styled(LowMarginText)`
  display: inline-block;
  
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FlexCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: left;
  
  white-space: nowrap;
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
  numProblems: number,
  onViewCode: (() => void) | null,
  onSpectateLive: (() => void) | null,
};

function PlayerResultsItem(props: PlayerResultsCardProps) {
  const {
    player, place, isCurrentPlayer, color, onViewCode, onSpectateLive,
  } = props;

  const score = useGetScore(player);
  const time = useGetSubmissionTime(player);
  const bestSubmission : Submission | null = useBestSubmission(player);

  const getSubmissionCount = () => player.submissions.length || '0';

  const getDisplayNickname = () => {
    const { nickname } = player.user;
    return `${nickname} ${isCurrentPlayer ? '(you)' : ''}`;
  };

  const getSubmissionTime = () => {
    if (!time) {
      return 'Never';
    }

    const currentTime = new Date().getTime();
    const diffMilliseconds = currentTime - new Date(time).getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));
    return `${diffMinutes}m ago`;
  };

  const getSubmissionLanguage = () => {
    if (!bestSubmission) {
      return 'N/A';
    }

    return (
      <PreviewContainer>
        <TextButton onClick={onViewCode}>
          {displayNameFromLanguage(bestSubmission.language as Language)}
          <PreviewIcon className="material-icons">launch</PreviewIcon>
        </TextButton>
      </PreviewContainer>
    );
  };

  return (
    <Content>
      <PlaceColumn>
        <PlayerText bold>{`${place}. `}</PlayerText>
      </PlaceColumn>

      <PlayerContent>
        <FlexCenter>
          <CircleIcon color={color.gradientColor} />
          <PlayerText bold={isCurrentPlayer}>{getDisplayNickname()}</PlayerText>
        </FlexCenter>
      </PlayerContent>

      <td>
        <Text>{score}</Text>
      </td>
      <td>
        <Text>{getSubmissionTime()}</Text>
      </td>
      <td>
        <Text>{getSubmissionCount()}</Text>
      </td>
      {!onSpectateLive ? (
        <CodeColumn>{getSubmissionLanguage()}</CodeColumn>
      ) : null}
      {onSpectateLive ? (
        <CodeColumn>
          <PreviewContainer>
            <TextButton onClick={onSpectateLive}>
              Launch
              <PreviewIcon className="material-icons">launch</PreviewIcon>
            </TextButton>
          </PreviewContainer>
        </CodeColumn>
      ) : null}
    </Content>
  );
}

export default PlayerResultsItem;
