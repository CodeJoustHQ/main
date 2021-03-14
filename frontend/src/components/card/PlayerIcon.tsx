import React from 'react';
import styled from 'styled-components';

type PlayerIconProps = {
  hexColor: string,
  active: boolean,
};

const PlayerIconContent = styled.div<PlayerIconProps>`
  background-color: ${({ theme, hexColor, active }) => (active ? hexColor : theme.colors.gray)};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;  
`;

function PlayerIcon(props: PlayerIconProps) {
  const { hexColor, active } = props;

  return (
    <PlayerIconContent hexColor={hexColor} active={active} />
  );
}

export default PlayerIcon;
