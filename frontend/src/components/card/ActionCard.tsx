import React from 'react';
import styled from 'styled-components';
import { SmallActionHeaderText, SmallActionText } from '../core/Text';
import { User } from '../../api/User';

type PlayerIconType = {
  isActive: boolean,
};

const Content = styled.div<PlayerIconType>`
  // Center div above parent
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translate(-50%, 0);
  
  width: 120px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  
  padding: 8px;

  z-index: 2;
  text-align: center;
`;

const ActionCardActiveIcon = styled.div<PlayerIconType>`
  display: inline-block;
  margin-right: 5px;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.gradients.green : theme.colors.gradients.red)};
  border-radius: 0.5rem;
  height: 0.5rem;
  width: 0.5rem;
`;

const ActionCardSeparator = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.text};
`;

const InlineHostIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  margin-right: 5px;
  font-size: 12px;
`;

const InlineSpectatorIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  margin-right: 5px;
  font-size: 12px;
`;

type ActionCardProps = {
  user: User,
  userIsHost: boolean,
  currentUserIsHost: boolean,
  isCurrentUser: boolean,
  userIsActive: boolean,
  onMakeHost: (newHost: User) => void,
  onRemoveUser: (user: User) => void,
};

function ActionCard(props: ActionCardProps) {
  const {
    user, userIsHost, currentUserIsHost, isCurrentUser, userIsActive, onMakeHost, onRemoveUser,
  } = props;

  return (
    <Content isActive={userIsActive}>
      <ActionCardActiveIcon isActive={userIsActive} />
      <SmallActionHeaderText>
        {userIsActive ? 'active' : 'inactive'}
      </SmallActionHeaderText>
      {
        userIsHost ? (
          <>
            <br />
            <SmallActionHeaderText>
              <InlineHostIcon>flag</InlineHostIcon>
              host
            </SmallActionHeaderText>
          </>
        ) : null
      }
      <ActionCardSeparator />
      {
        (!currentUserIsHost && !isCurrentUser) ? (
          <SmallActionHeaderText>No actions allowed</SmallActionHeaderText>
        ) : null
      }
      {
        isCurrentUser ? (
          <SmallActionText onClick={() => {}}>Spectate Game</SmallActionText>
        ) : null
      }
      {
        // Only show the make host button if user is active
        (currentUserIsHost && !isCurrentUser && userIsActive) ? (
          <SmallActionText onClick={() => onMakeHost(user)}>Make Host</SmallActionText>
        ) : null
      }
      {
        (currentUserIsHost && !isCurrentUser) ? (
          <SmallActionText onClick={() => onRemoveUser(user)}>Kick</SmallActionText>
        ) : null
      }
    </Content>
  );
}

export default ActionCard;
