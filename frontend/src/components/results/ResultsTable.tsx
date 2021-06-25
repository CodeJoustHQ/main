/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import PlayerResultsItem from './PlayerResultsItem';
import { User } from '../../api/User';
import { NextIcon, PrevIcon } from '../core/Icon';
import { ProblemNavButton } from '../core/Button';
import { Problem } from '../../api/Problem';

const Content = styled.div`
  width: 65%;
  text-align: left;
  margin: 0 auto;
`;

const TableContent = styled.table`
  text-align: center;
  width: 100%;
  min-width: 600px;
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

const PrimaryTableHeader = styled.th`
  text-align: left;
`;

const SmallColumn = styled.th`
  width: 100px;
`;

type ResultsTableProps = {
  players: Player[],
  currentUser: User | null,
  gameStartTime: string,
  numProblems: number,
  viewPlayerCode: ((index: number) => void) | null,
  spectatePlayer: ((index: number) => void) | null,
};

function ResultsTable(props: ResultsTableProps) {
  const {
    players, currentUser, gameStartTime, numProblems, viewPlayerCode, spectatePlayer,
  } = props;

  const [problemIndex, setProblemIndex] = useState(0);
  const problems: string[] = ['t', 'af', 'af']; // TODO: temp - replace with prop

  const nextProblem = () => {
    const next = problemIndex + 1;

    if (problems && next < problems.length) {
      setProblemIndex(next);
    }
  };

  const previousProblem = () => {
    const prev = problemIndex - 1;

    if (prev >= 0) {
      setProblemIndex(prev);
    }
  };

  return (
    <Content>
      <ProblemNavButton onClick={previousProblem} disabled={problemIndex <= 0}>
        <PrevIcon />
      </ProblemNavButton>
      <ProblemNavButton onClick={nextProblem} disabled={problemIndex + 1 >= problems.length}>
        <NextIcon />
      </ProblemNavButton>
      <TableContent>
        <tr>
          <th />
          <PrimaryTableHeader>Player</PrimaryTableHeader>
          <th>Score</th>
          <th>Time</th>
          <SmallColumn>Submissions</SmallColumn>
          {!spectatePlayer ? <th>Code</th> : null}
          {spectatePlayer ? <th>Spectate Live</th> : null}
        </tr>
        {players?.map((player, index) => (
          <PlayerResultsItem
            player={player}
            place={index + 1}
            isCurrentPlayer={currentUser?.userId === player.user.userId}
            gameStartTime={gameStartTime}
            color={player.color}
            numProblems={numProblems}
            onViewCode={viewPlayerCode ? (() => viewPlayerCode(index)) : null}
            onSpectateLive={spectatePlayer ? (() => spectatePlayer(index)) : null}
          />
        ))}
      </TableContent>
    </Content>
  );
}

export default ResultsTable;
