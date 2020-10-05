import React, { useState } from 'react';
import styled from 'styled-components';
import { UserNicknameText } from '../core/Text';
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
  children: React.ReactNode,
};

function PlayerCard(props: PlayerCardProps) {
  const { user, isHost, children: actionCard } = props;

  const [showActionCard, setShowActionCard] = useState(false);

  return (
    <Content onClick={() => setShowActionCard(!showActionCard)}>
      <UserNicknameText>
        {user.nickname}
        {isHost ? ' (host)' : ''}
      </UserNicknameText>

      {showActionCard ? actionCard : null}
    </Content>
  );
}

export default PlayerCard;
