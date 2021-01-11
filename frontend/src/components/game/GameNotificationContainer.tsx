import React from 'react';
import styled from 'styled-components';
import { GameNotification, NotificationType } from '../../api/GameNotification';

const GameNotificationBox = styled.div`
  position: absolute;
  bottom: 25px;
  left: 25px;
  padding: 25px;
  max-width: 20vw;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  background: linear-gradient(${({ theme }) => theme.colors.white}, ${({ theme }) => theme.colors.lightBlue});
  box-shadow: ${({ theme }) => theme.colors.lightGray} 0px 8px 24px;
  border-radius: 5px;
  transition: 0.25s all;

  &:hover {
    background: ${({ theme }) => theme.colors.lightBlue};
  }
`;

const notificationToString = (notification: GameNotification): string => {
  const timeElapsed: number = Date.now() - new Date(notification.time).getTime();

  switch (notification.notificationType) {
    case NotificationType.SubmitCorrect: {
      return `${notification.initiator.nickname} just submitted correctly
        ${notification.content ? `, taking ${notification.content} place, ` : ''} ${timeElapsed} seconds ago.`;
    }
    case NotificationType.SubmitIncorrect: {
      return `${notification.initiator.nickname} just submitted incorrectly.`;
    }

    case NotificationType.TestCorrect: {
      return `${notification.initiator.nickname} passed a test case
        ${notification.content ? ` with result '${notification.content}'` : ''}
        ${timeElapsed} seconds ago.`;
    }

    case NotificationType.CodeStreak: {
      return `${notification.initiator.nickname} is on a coding streak!`;
    }

    default: {
      return '5';
    }
  }
};

type GameNotificationProps = {
  gameNotification: GameNotification | null,
};

// This function refreshes the width of Monaco editor upon change in container size
function GameNotificationContainer(props: GameNotificationProps) {
  // If props or child are null, return null as well, showing no notification.
  if (props == null) {
    return null;
  }

  const { gameNotification } = props;
  if (gameNotification == null) {
    return null;
  }

  return (
    <GameNotificationBox>
      {notificationToString(gameNotification)}
    </GameNotificationBox>
  );
}

export default GameNotificationContainer;
