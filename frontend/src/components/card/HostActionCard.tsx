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
  
  height: ${({ isActive }) => (isActive ? '90px' : '65px')};
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

type HostActionCardProps = {
  user: User,
  userIsActive: boolean,
  onMakeHost: (newHost: User) => void,
  onRemoveUser: (user: User) => void,
};

function HostActionCard(props: HostActionCardProps) {
  const {
    user, userIsActive, onMakeHost, onRemoveUser,
  } = props;

  return (
    <Content isActive={userIsActive}>
      <ActionCardActiveIcon isActive={userIsActive} />
      <SmallActionHeaderText>{userIsActive ? 'active' : 'inactive'}</SmallActionHeaderText>
      <ActionCardSeparator />
      {
        // Only show the make host button if user is active
        userIsActive
          ? <SmallActionText onClick={() => onMakeHost(user)}>Make Host</SmallActionText>
          : null
      }
      <SmallActionText onClick={() => onRemoveUser(user)}>Kick</SmallActionText>
    </Content>
  );
}

export default HostActionCard;
