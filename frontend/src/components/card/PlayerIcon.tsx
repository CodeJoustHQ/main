import React from 'react';
import styled from 'styled-components';
import { WhiteText } from '../core/Text';

type PlayerIconProps = {
  gradientColor: string,
  nickname: string,
  active: boolean,
};

type PlayerIconContentProps = {
  gradientColor: string,
  active: boolean,
};

const PlayerIconContent = styled.div<PlayerIconContentProps>`
  background: ${({ theme, gradientColor, active }) => (active ? theme.colors.gradients[gradientColor] : theme.colors.gray)};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  line-height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { gradientColor, nickname, active } = props;

  const getDisplayNickname = () => nickname.charAt(0).toUpperCase();

  return (
    <PlayerIconContent gradientColor={gradientColor} active={active}>
      <WhiteText>{getDisplayNickname()}</WhiteText>
    </PlayerIconContent>
  );
}

export default PlayerIcon;
