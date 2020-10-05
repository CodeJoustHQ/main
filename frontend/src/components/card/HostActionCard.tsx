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
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
  
  height: 20px;
  padding: 10px;
  
  // -(height + 2 * padding + :before-border-width / sqrt(2))
  margin-top: -55px;
  
  // Create the arrow at the bottom of the popup
  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    box-sizing: border-box;
    z-index: 1;
    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.24);
    
    border-style: solid;
    border-color: transparent transparent ${({ theme }) => theme.colors.white} ${({ theme }) => theme.colors.white};
    transform-origin: 0 0;
    transform: rotate(-45deg);
    
    border-width: 8px;
    
    // -(sqrt(2) * border-width)
    margin-left: -12px;
    // -(2 * border-width)
    bottom: -16px;
  }
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
      <SmallActionText onClick={() => onMakeHost(user)}>Make Host</SmallActionText>
      <SmallActionText onClick={() => onDeleteUser(user)}>Kick</SmallActionText>
    </Content>
  );
}

export default HostActionCard;
