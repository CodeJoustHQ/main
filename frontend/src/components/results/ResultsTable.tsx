/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import PlayerResultsItem from './PlayerResultsItem';
import { User } from '../../api/User';
import { NextIcon, PrevIcon } from '../core/Icon';
import { ProblemNavButton } from '../core/Button';
import { Problem } from '../../api/Problem';
import { NoMarginSubtitleText } from '../core/Text';

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

const TopContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
`;

const ProblemText = styled(NoMarginSubtitleText)`
  display: inline;
  margin: 0 12px;
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
  problems: Problem[],
  viewPlayerCode: ((playerIndex: number, probIndex: number) => void) | null,
  spectatePlayer: ((index: number) => void) | null,
};

function ResultsTable(props: ResultsTableProps) {
  const {
    players, currentUser, gameStartTime, problems, viewPlayerCode, spectatePlayer,
  } = props;

  // todo: use value -1 to represent overview mode
  const [problemIndex, setProblemIndex] = useState(-1);

  const nextProblem = () => {
    const next = problemIndex + 1;

    if (problems && next < problems.length) {
      setProblemIndex(next);
    }
  };

  const previousProblem = () => {
    const prev = problemIndex - 1;

    if (prev >= -1) {
      setProblemIndex(prev);
    }
  };

  const getFinalColumn = () => {
    if (problemIndex === -1) {
      return null;
    }

    return !spectatePlayer ? <th>Code</th> : <th>Spectate Live</th>
  };

  return (
    <Content>
      <TopContent>
        <ProblemNavButton onClick={previousProblem} disabled={problemIndex <= -1}>
          <PrevIcon />
        </ProblemNavButton>
        <ProblemText>
          {problemIndex !== -1 ? `Problem ${problemIndex + 1} of ${problems.length}. ` : null}
          <b>{problemIndex !== -1 ? problems[problemIndex]?.name || '' : 'Overview'}</b>
        </ProblemText>
        <ProblemNavButton onClick={nextProblem} disabled={problemIndex + 1 >= problems.length}>
          <NextIcon />
        </ProblemNavButton>
      </TopContent>
      <TableContent>
        <tr>
          <th />
          <PrimaryTableHeader>Player</PrimaryTableHeader>
          <th>{problemIndex === -1 ? 'Problems Solved' : 'Tests Passed'}</th>
          <th>Time</th>
          <SmallColumn>{problemIndex === -1 ? 'Submissions' : 'Attempts'}</SmallColumn>
          {getFinalColumn()}
        </tr>
        {players?.map((player, index) => (
          <PlayerResultsItem
            player={player}
            place={index + 1}
            isCurrentPlayer={currentUser?.userId === player.user.userId}
            gameStartTime={gameStartTime}
            color={player.color}
            problemIndex={problemIndex}
            onViewCode={viewPlayerCode ? (() => viewPlayerCode(index, problemIndex)) : null}
            onSpectateLive={spectatePlayer ? (() => spectatePlayer(index)) : null}
          />
        ))}
      </TableContent>
    </Content>
  );
}

export default ResultsTable;
