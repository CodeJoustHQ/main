import React from 'react';
import styled from 'styled-components';
import { SmallActionText, UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

const Content = styled.div`
  display: inline-block;
  margin: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  border-radius: 5px;
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

      {showActions ? (
        <div>
          <SmallActionText onClick={() => onMakeHost(user)}>Make host</SmallActionText>
          <SmallActionText onClick={() => onDeleteUser(user)}>Kick</SmallActionText>
        </div>
      ) : null}
    </Content>
  );
}

export default PlayerCard;
