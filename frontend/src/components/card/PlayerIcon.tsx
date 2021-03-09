import React from 'react';
import styled from 'styled-components';
import { WhiteText } from '../core/Text';

type PlayerIconProps = {
  gradientColor: string,
  nickname: string,
};

type PlayerIconContentProps = {
  gradientColor: string,
};

const PlayerIconContent = styled.div<PlayerIconContentProps>`
  background: ${({ theme, gradientColor }) => theme.colors[gradientColor]};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  line-height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { gradientColor, nickname } = props;

  const getDisplayNickname = () => nickname.charAt(0).toUpperCase();

  return (
    <PlayerIconContent gradientColor={gradientColor}>
      <WhiteText>{getDisplayNickname()}</WhiteText>
    </PlayerIconContent>
  );
}

export default PlayerIcon;
