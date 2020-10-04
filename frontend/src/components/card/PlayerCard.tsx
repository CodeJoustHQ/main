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
  currentUser: User,
  host: User,
  onMakeHost: (newHost: User) => void,
  onDeleteUser: (userToDelete: User) => void,
};

function PlayerCard(props: PlayerCardProps) {
  const {
    user, currentUser, host, onMakeHost, onDeleteUser,
  } = props;

  return (
    <Content>
      <UserNicknameText>
        {user.nickname}
        {user.nickname === host.nickname ? ' (host)' : ''}
      </UserNicknameText>

      {currentUser.nickname === host.nickname ? (
        <div>
          <SmallActionText onClick={() => onMakeHost(user)}>Make host</SmallActionText>
          <SmallActionText onClick={() => onDeleteUser(user)}>Kick</SmallActionText>
        </div>
      ) : null}
    </Content>
  );
}

export default PlayerCard;
