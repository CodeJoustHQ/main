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

export const InlineQuestionIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding: 0.25rem;
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  color: ${({ theme }) => theme.colors.font};

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
`;

type ActionCardProps = {
  user: User,
  userIsHost: boolean,
  currentUserIsHost: boolean,
  isCurrentUser: boolean,
  userIsActive: boolean,
  onMakeHost: (newHost: User) => void,
  onRemoveUser: (user: User) => void,
  onUpdateSpectator: (user: User) => void,
  setActionCardHelp: (actionCardHelp: boolean) => void,
};

function ActionCard(props: ActionCardProps) {
  const {
    user, userIsHost, currentUserIsHost, isCurrentUser, userIsActive,
    onMakeHost, onRemoveUser, onUpdateSpectator, setActionCardHelp,
  } = props;

  return (
    <Content isActive={userIsActive}>
      <InlineQuestionIcon
        onClick={() => setActionCardHelp(true)}
      >
        help_outline
      </InlineQuestionIcon>
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
      {
        user.spectator ? (
          <>
            <br />
            <SmallActionHeaderText>
              <InlineSpectatorIcon>visibility</InlineSpectatorIcon>
              spectator
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
          <SmallActionText onClick={() => onUpdateSpectator(user)}>
            {user.spectator ? 'Compete in Game' : 'Spectate Game'}
          </SmallActionText>
        ) : null
      }
      {
        (currentUserIsHost && !userIsHost) ? (
          <SmallActionText onClick={() => onUpdateSpectator(user)}>
            {user.spectator ? 'Make Competitor' : 'Make Spectator'}
          </SmallActionText>
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
