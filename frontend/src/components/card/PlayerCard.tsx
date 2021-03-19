import React, { useState } from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

const TransparentHoverContainer = styled.div`
  display: inline-block;
  background-clip: padding-box;

  // Invisible border to make hover effect last longer
  border: 10px solid transparent;
`;

const Content = styled.div`
  display: inline-block;
  position: relative;
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
    <TransparentHoverContainer
      onMouseEnter={() => setShowActionCard(true)}
      onMouseLeave={() => setShowActionCard(false)}
    >
      <Content>
        <UserNicknameText me={me}>
          <PlayerCardActiveIcon isActive={isActive} />
          {user.nickname}
          {isHost ? <InlineHostIcon>flag</InlineHostIcon> : null}
        </UserNicknameText>

        {showActionCard ? actionCard : null}
      </Content>
    </TransparentHoverContainer>
  );
}

export default PlayerCard;
