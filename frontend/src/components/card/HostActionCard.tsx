import React from 'react';
import styled from 'styled-components';
import { SmallActionText } from '../core/Text';
import { User } from '../../api/User';

const Content = styled.div`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
`;

type HostActionCardProps = {
  user: User,
  onMakeHost: (newHost: User) => void,
  onDeleteUser: (userToDelete: User) => void,
};

function HostActionCard(props: HostActionCardProps) {
  const { user, onMakeHost, onDeleteUser } = props;

  return (
    <Content>
      <div>
        <SmallActionText onClick={() => onMakeHost(user)}>Make Host</SmallActionText>
        <SmallActionText onClick={() => onDeleteUser(user)}>Kick</SmallActionText>
      </div>
    </Content>
  );
}

export default HostActionCard;
