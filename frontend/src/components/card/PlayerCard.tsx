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
  box-shadow: 0 1px 8px rgb(0 0 0 / 24%);
  padding: 0.25rem 1rem;
  background-color: ${({ theme }) => theme.colors.white};

  // Subtract above border width from border-radius for actual effect 
  border-radius: 1rem;
`;

type PlayerIconType = {
  isActive: boolean,
};

const PlayerCardActiveIcon = styled.div<PlayerIconType>`
  display: inline-block;
  margin-right: 10px;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.gradients.green : theme.colors.gradients.red)};
  border-radius: 1rem;
  height: 1.3rem;
  width: 1.3rem;
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

  const InlineHostIcon = styled.i.attrs(() => ({
    className: 'material-icons',
  }))`
    margin-left: 5px;
  `;

  return (
    <Content
      onMouseEnter={() => setShowActionCard(true)}
      onMouseLeave={() => setShowActionCard(false)}
      isActive={isActive}
    >
      <UserNicknameText>
        <PlayerCardActiveIcon isActive={isActive} />
        {user.nickname}
        {isHost ? <InlineHostIcon>flag</InlineHostIcon> : null}
      </UserNicknameText>

      {showActionCard ? actionCard : null}
    </Content>
  );
}

export default PlayerCard;
