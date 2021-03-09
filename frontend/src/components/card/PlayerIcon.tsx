import React from 'react';
import styled from 'styled-components';

type PlayerIconProps = {
  gradientColor: string,
};

const PlayerIconContent = styled.div<PlayerIconProps>`
  background: ${({ theme, gradientColor }) => theme.colors[gradientColor]};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { gradientColor } = props;

  return (
    <PlayerIconContent gradientColor={gradientColor} />
  );
}

export default PlayerIcon;
