import React from 'react';
import styled from 'styled-components';
import { SmallActionText } from '../core/Text';
import { User } from '../../api/User';

const Content = styled.div`
  // Center div above parent
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  
  width: 150px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px 5px 0 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  
  height: 20px;
  padding: 8px;
  
  // -(height + 2 * padding - 3px)
  margin-top: -36px;
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
    <Content>
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
