import React from 'react';
import styled from 'styled-components';
import { SelectableProblem } from '../../api/Problem';
import { DifficultyDisplayButton } from '../core/Button';
import { displayNameFromDifficulty } from '../../api/Difficulty';

type SelectedProblemsDisplayProps = {
  problems: SelectableProblem[],
  onRemove: ((index: number) => void) | null,
}

const Content = styled.div`

`;

const ProblemName = styled.p`
  font-weight: bold;
  display: inline;
  margin: 0 10px;
`;

const ProblemDisplay = styled.div`
  display: inline-block;
  padding: 5px 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
`;

function SelectedProblemsDisplay(props: SelectedProblemsDisplayProps) {
  const { problems, onRemove } = props;

  return (
    <Content>
      {problems.map((problem) => (
        <ProblemDisplay key={problem.problemId}>
          <ProblemName>
            {problem.name}
          </ProblemName>
          <DifficultyDisplayButton
            difficulty={problem.difficulty}
            enabled={false}
            active
          >
            {displayNameFromDifficulty(problem.difficulty)}
          </DifficultyDisplayButton>
        </ProblemDisplay>
      ))}
    </Content>
  );
}

export default SelectedProblemsDisplay;
