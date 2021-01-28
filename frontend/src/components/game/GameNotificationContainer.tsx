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
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.colors.lightGray} 0px 8px 24px;
  border-radius: 5px;
  z-index: 1;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transition: 0.5s all;
    cursor: pointer;
  }
`;

const notificationToString = (notification: GameNotification): string => {
  switch (notification.notificationType) {
    case NotificationType.SubmitCorrect: {
      return `${notification.initiator.nickname} just submitted correctly
        ${notification.content ? `, taking ${notification.content} place, ` : ''}.`;
    }
    case NotificationType.SubmitIncorrect: {
      return `${notification.initiator.nickname} just submitted incorrectly.`;
    }

    case NotificationType.TestCorrect: {
      return `${notification.initiator.nickname} just passed a test case
        ${notification.content ? ` with result '${notification.content}'` : ''}.`;
    }

    case NotificationType.CodeStreak: {
      return `${notification.initiator.nickname} is on a coding streak!`;
    }

    case NotificationType.TimeLeft: {
      return `There ${notification.content} left.`;
    }

    default: {
      return 'There was a mysterious, unknown notification.';
    }
  }
};

type GameNotificationProps = {
  gameNotification: GameNotification | null,
  onClickFunc: (gameNotification: GameNotification | null) => void,
}

function GameNotificationContainer(props: GameNotificationProps) {
  const { gameNotification, onClickFunc } = props;
  if (gameNotification == null || onClickFunc == null) {
    return null;
  }

  return (
    <GameNotificationBox onClick={() => onClickFunc(null)}>
      {notificationToString(gameNotification)}
    </GameNotificationBox>
  );
}

export default GameNotificationContainer;
