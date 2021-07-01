import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import { Text, MediumText } from '../core/Text';
import Language, { displayNameFromLanguage } from '../../api/Language';
import { useBestSubmission, useGetScore, useGetSubmissionTime } from '../../util/Hook';
import { getTimeBetween } from '../../util/Utility';

type PodiumProps = {
  place: number,
  player: Player | undefined,
  gameStartTime: string,
  inviteContent: React.ReactNode,
  loading: boolean,
  isCurrentPlayer: boolean,
  numProblems: number,
};

type MedalProps = {
  color: string,
};

type PodiumContainerProps = {
  isCurrentPlayer: boolean
  height: number,
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PodiumContainer = styled.div<PodiumContainerProps>`
  position: relative;
  display: inline-block;
  box-shadow: ${({ isCurrentPlayer }) => (isCurrentPlayer
    ? '0 2px 12px rgba(255, 199, 0, 0.24)' : '0 1px 4px rgba(0, 0, 0, 0.12)')};
  width: 180px;
  height: ${({ height }) => height}px;
  padding: 10px;
  margin: 5px 10px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;

const WinnerText = styled(MediumText)`
  font-weight: bold;
  margin: 0 auto;
  width: 180px;
  
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ScoreText = styled(MediumText)`
  font-weight: normal;
  margin: 0;
`;

const SmallerText = styled(Text)`
  margin: 5px 0;
`;

const BottomContent = styled.div`
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Medal = styled.div<MedalProps>`
  background: ${({ theme, color }) => theme.colors.gradients[color]};
  border-radius: 50%;
  margin: 15px auto;
  
  height: 50px;
  width: 50px;  
  line-height: 50px;
`;

function Podium(props: PodiumProps) {
  const {
    place, player, gameStartTime, loading, inviteContent, isCurrentPlayer, numProblems,
  } = props;

  const score = useGetScore(player);
  const bestSubmission = useBestSubmission(player);
  const time = useGetSubmissionTime(player);

  const getMedalColor = () => {
    switch (place) {
      case 1:
        return 'yellow';
      case 2:
        return 'silver';
      default:
        return 'bronze';
    }
  };

  const getPodiumHeight = () => {
    switch (place) {
      case 1:
        return 280;
      case 2:
        return 240;
      default:
        return 210;
    }
  };

  const getScoreText = () => {
    if (!player) {
      if (loading) {
        return <ScoreText>{loading ? 'Loading...' : 'Invite'}</ScoreText>;
      }
      return inviteContent;
    }

    if (!score) {
      return (
        <ScoreText>
          Scored
          {' '}
          <b>0</b>
        </ScoreText>
      );
    }

    const percent = Math.round((score / numProblems) * 100);
    return (
      <ScoreText>
        Scored
        <b>{` ${percent}%`}</b>
      </ScoreText>
    );
  };

  const getTimeText = () => {
    if (!time) {
      return <SmallerText />;
    }

    const diffMinutes = getTimeBetween(gameStartTime, time);
    return (
      <SmallerText>
        in
        <b>{` ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`}</b>
      </SmallerText>
    );
  };

  const getLanguageText = () => {
    if (!bestSubmission) {
      return <SmallerText />;
    }

    return (
      <SmallerText>
        Language:
        <b>{` ${displayNameFromLanguage(bestSubmission.language as Language)}`}</b>
      </SmallerText>
    );
  };

  return (
    <Content>
      <div>
        <WinnerText>{player?.user.nickname || ''}</WinnerText>
        <PodiumContainer height={getPodiumHeight()} isCurrentPlayer={isCurrentPlayer}>
          <Medal color={getMedalColor()} />
          {getScoreText()}
          {getTimeText()}

          <BottomContent>
            {getLanguageText()}
          </BottomContent>
        </PodiumContainer>
      </div>
    </Content>
  );
}

export default Podium;
