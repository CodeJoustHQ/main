import React, { useState } from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

const Content = styled.div`
  display: inline-block;
  position: relative;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  background-clip: padding-box;
  
  // Invisible border to make hover effect last longer
  border: 15px solid transparent;
  
  // Add above border width from margin for actual effect
  margin: -5px;
  // Subtract above border width from border-radius for actual effect 
  border-radius: 20px;
  
  &:hover {
    cursor: pointer;
  }
`;

type PlayerCardProps = {
  user: User,
  isHost: boolean,
  children: React.ReactNode,
};

function PlayerCard(props: PlayerCardProps) {
  const { user, isHost, children: actionCard } = props;

  const [showActionCard, setShowActionCard] = useState(false);

  return (
    <Content
      onMouseEnter={() => setShowActionCard(true)}
      onMouseLeave={() => setShowActionCard(false)}
    >
      <UserNicknameText>
        {user.nickname}
        {isHost ? ' (host)' : ''}
      </UserNicknameText>

      {showActionCard ? actionCard : null}
    </Content>
  );
}

export default PlayerCard;
