import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import PlayerResultsItem from './PlayerResultsItem';
import { User } from '../../api/User';

const Content = styled.table`
  width: 80%;
  margin: 0 auto;
  
  border-collapse: separate; 
  border-spacing: 0 10px;
  
  tr td:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  tr td:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

type ResultsTableProps = {
  players: Player[],
  currentUser: User | null,
};

function ResultsTable(props: ResultsTableProps) {
  const {
    players, currentUser,
  } = props;

  return (
    <Content>
      <tr>
        <th>Player</th>
        <th>Score</th>
        <th>Time</th>
        <th>Submissions</th>
        <th>Code</th>
      </tr>
      {players?.map((player, index) => (
        <PlayerResultsItem
          player={player}
          place={index + 1}
          isCurrentPlayer={currentUser?.userId === player.user.userId}
          color={player.color}
        />
      ))}
    </Content>
  );
}

export default ResultsTable;
