import React from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

const Content = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

type PlayerCardProps = {
  user: User,
  isHost: boolean,
  onMakeHost: (newHost: User) => void,
  onDeleteUser: (userToDelete: User) => void,
  showActions: boolean,
};

function PlayerCard(props: PlayerCardProps) {
  const {
    user, isHost, onMakeHost, onDeleteUser, showActions,
  } = props;

  return (
    <Content>
      <UserNicknameText>
        {user.nickname}
        {isHost ? ' (host)' : ''}
      </UserNicknameText>
    </Content>
  );
}

export default PlayerCard;
