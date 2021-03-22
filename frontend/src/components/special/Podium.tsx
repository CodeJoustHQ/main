import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';

type PodiumProps = {
  place: string,
  player?: Player,
};

type MedalProps = {
  place: number,
  player?: Player,
};

const PodiumContainer = styled.div`
  display: block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  width: 300px;
  height: 500px;
  padding: 10px;
  margin: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;

const Medal = styled.div<MedalProps>`
  background: ${({ theme }) => theme.colors.gradients.yellow};
  border-radius: 50%;
  margin: 0 auto;
  
  height: 50px;
  width: 50px;  
  line-height: 50px;
`;

function Podium(props: PodiumProps) {
  const { place } = props;

  return (
    <PodiumContainer>
      <Medal />
      Score
      Time
      Language
    </PodiumContainer>
  );
}

export default Podium;
