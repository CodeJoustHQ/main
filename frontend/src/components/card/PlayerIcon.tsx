import React from 'react';
import styled from 'styled-components';

type PlayerIconProps = {
  hexColor: string,
};

const PlayerIconContent = styled.div<PlayerIconProps>`
  background-color: ${({ hexColor }) => hexColor};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { hexColor } = props;

  return (
    <PlayerIconContent hexColor={hexColor} />
  );
}

export default PlayerIcon;
