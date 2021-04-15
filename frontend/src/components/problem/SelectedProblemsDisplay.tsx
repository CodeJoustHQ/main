import React from 'react';
import styled from 'styled-components';
import { SelectableProblem } from '../../api/Problem';
import { InlineDifficultyDisplayButton } from '../core/Button';
import { displayNameFromDifficulty } from '../../api/Difficulty';

type SelectedProblemsDisplayProps = {
  problems: SelectableProblem[],
  onRemove: ((index: number) => void) | null,
}

const Content = styled.div`
  margin: 5px 0;
`;

const ProblemName = styled.p`
  font-weight: bold;
  display: inline;
  margin: 0 10px;
`;

const ProblemDisplay = styled.div`
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
`;

const RemoveText = styled.p`
  display: inline;
  margin: 5px 10px;

  &:hover {
    cursor: pointer;
  }
`;

function SelectedProblemsDisplay(props: SelectedProblemsDisplayProps) {
  const { problems, onRemove } = props;

  return (
    <Content>
      {problems.map((problem, index) => (
        <ProblemDisplay key={problem.problemId}>
          <ProblemName>
            {problem.name}
          </ProblemName>
          <InlineDifficultyDisplayButton
            difficulty={problem.difficulty}
            enabled={false}
            active
          >
            {displayNameFromDifficulty(problem.difficulty)}
          </InlineDifficultyDisplayButton>
          {onRemove ? <RemoveText onClick={() => onRemove(index)}>X</RemoveText> : null}
        </ProblemDisplay>
      ))}
    </Content>
  );
}

export default SelectedProblemsDisplay;
