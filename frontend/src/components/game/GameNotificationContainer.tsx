import React from 'react';
import styled from 'styled-components';
import { GameNotification, NotificationType } from '../../api/GameNotification';
import { User } from '../../api/User';

const GameNotificationBox = styled.div`
  position: absolute;
  bottom: 25px;
  left: 25px;
  padding: 25px;
  max-width: 20vw;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  background: linear-gradient(${({ theme }) => theme.colors.white}, ${({ theme }) => theme.colors.background});
  box-shadow: ${({ theme }) => theme.colors.lightGray} 0px 8px 24px;
  border-radius: 5px;
  transition: background 0.5s;
  z-index: 1;

  &:hover {
    background: linear-gradient(${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background});
  }
`;

const notificationToString = (notification: GameNotification): string => {
  const timeElapsed: number = Math.ceil((Date.now()
    - new Date(notification.time).getTime()) / 1000);

  switch (notification.notificationType) {
    case NotificationType.SubmitCorrect: {
      return `${notification.initiator.nickname} just submitted correctly
        ${notification.content ? `, taking ${notification.content} place, ` : ''} ${timeElapsed} second(s) ago.`;
    }
    case NotificationType.SubmitIncorrect: {
      return `${notification.initiator.nickname} just submitted incorrectly.`;
    }

    case NotificationType.TestCorrect: {
      return `${notification.initiator.nickname} passed a test case
        ${notification.content ? ` with result '${notification.content}'` : ''}
        ${timeElapsed} second(s) ago.`;
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
  currentUser: User | null,
};

// This function refreshes the width of Monaco editor upon change in container size
function GameNotificationContainer(props: GameNotificationProps) {
  // If props or child are null, return null as well, showing no notification.
  if (props == null) {
    return null;
  }

  const { gameNotification, currentUser } = props;
  if (gameNotification == null || currentUser == null) {
    return null;
  }

  // If the initiator of the notification is the currentUser, show nothing.
  if (gameNotification.initiator.userId === currentUser.userId) {
    return null;
  }

  return (
    <GameNotificationBox>
      {notificationToString(gameNotification)}
    </GameNotificationBox>
  );
}

export default GameNotificationContainer;
