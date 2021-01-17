import React from 'react';
import styled from 'styled-components';

type PlayerIconProps = {
  color: string,
};

const PlayerIconContent = styled.div<PlayerIconProps>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { color } = props;

  return (
    <PlayerIconContent color={color} />
  );
}

export default PlayerIcon;
