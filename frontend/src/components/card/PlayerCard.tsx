import React, { useState } from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

type ContentProps = {
  isActive: boolean,
};

const Content = styled.div<ContentProps>`
  display: inline-block;
  position: relative;
  padding: 10px;
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.lightBlue : theme.colors.lightRed)};
  background-clip: padding-box;
  
  // Invisible border to make hover effect last longer
  border: 15px solid transparent;
  
  // Add above border width from margin for actual effect
  margin: -5px;
  // Subtract above border width from border-radius for actual effect 
  border-radius: 20px;
`;

const ContentInactive = styled(Content)`
  background-color: ${({ theme }) => theme.colors.lightRed};
`;

type PlayerCardProps = {
  user: User,
  isActive: boolean,
  isHost: boolean,
  children: React.ReactNode,
};

function PlayerCard(props: PlayerCardProps) {
  const {
    user, isActive, isHost, children: actionCard,
  } = props;

  const [showActionCard, setShowActionCard] = useState(false);

  return (
    <ContentInactive
      onMouseEnter={() => setShowActionCard(true)}
      onMouseLeave={() => setShowActionCard(false)}
      isActive={isActive}
    >
      <UserNicknameText>
        {user.nickname}
        {isHost ? ' (host)' : ''}
      </UserNicknameText>

      {showActionCard ? actionCard : null}
    </ContentInactive>
  );
}

export default PlayerCard;
