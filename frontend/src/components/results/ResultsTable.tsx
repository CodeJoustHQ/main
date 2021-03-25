import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';

const Content = styled.div`

`;

type ResultsTableProps = {
  players: Player[],
};

function ResultsTable(props: ResultsTableProps) {
  const {
    players,
  } = props;

  return (
    <Content>
      Player table goes here
    </Content>
  );
}

export default ResultsTable;