import React, { useState } from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

type ContentProps = {
  isActive: boolean,
};

const Content = styled.div<ContentProps>`
  display: inline-block;
  margin: 0.5rem 0.75rem;
  padding: 0.25rem 1rem;
  box-shadow: 0 1px 8px rgb(0 0 0 / 24%);
  background-color: ${({ theme }) => theme.colors.white};
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
  me: boolean,
  isActive: boolean,
  isHost: boolean,
  children: React.ReactNode,
};

function PlayerCard(props: PlayerCardProps) {
  const {
    user, me, isActive, isHost, children: actionCard,
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
      <UserNicknameText me={me}>
        <PlayerCardActiveIcon isActive={isActive} />
        {user.nickname}
        {isHost ? <InlineHostIcon>flag</InlineHostIcon> : null}
      </UserNicknameText>

      {showActionCard ? actionCard : null}
    </Content>
  );
}

export default PlayerCard;
