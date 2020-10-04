import React from 'react';
import { UserNicknameText } from '../core/Text';
import { User } from '../../api/User';

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
    <div>
      <UserNicknameText>
        {user.nickname}
        {isHost ? ' (host)' : ''}
      </UserNicknameText>
    </div>
  );
}

export default PlayerCard;
