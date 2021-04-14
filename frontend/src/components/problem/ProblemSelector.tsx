import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { DifficultyDisplayButton } from '../core/Button';
import SelectedProblemsDisplay from './SelectedProblemsDisplay';

type ProblemSelectorProps = {
  onSelect: (problems: SelectableProblem[]) => void,
};

type ContentProps = {
  show: boolean,
};

type InlineProblemProps = {
  selected: boolean,
};

const InnerContent = styled.div<ContentProps>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  border-radius: 5px;
`;

const InlineProblem = styled.div<InlineProblemProps>`
  width: 300px;
  height: 50px;
  display: flex;
  flex: auto;
  justify-content: space-between;
  
  background-color: ${({ theme, selected }) => (selected ? theme.colors.gray : theme.colors.white)};
  border: solid 1px ${({ theme }) => theme.colors.gray};
  
  &:hover {
    cursor: pointer;
  }
`;

const ProblemName = styled.p`
  font-weight: bold;
`;

function ProblemSelector(props: ProblemSelectorProps) {
  const { onSelect } = props;

  const [error, setError] = useState('');
  const [problems, setProblems] = useState<SelectableProblem[]>([]);
  const [showProblems, setShowProblems] = useState(false);

  useEffect(() => {
    getProblems()
      .then((res) => {
        setProblems(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const toggleSelectedStatus = (index: number) => {
    const newProblems = problems.map((problem, i) => {
      if (index === i) {
        return { ...problem, selected: !problem.selected };
      }
      return problem;
    });

    setProblems(newProblems);

    onSelect(newProblems.filter((problem) => problem.selected));
  };

  return (
    <div>
      <button onClick={() => setShowProblems(!showProblems)}>Select a problem...</button>
      <InnerContent show={showProblems}>
        {problems.map((problem, index) => (
          <InlineProblem
            key={problem.name}
            selected={Boolean(problem.selected)}
            onClick={() => toggleSelectedStatus(index)}
          >
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
          </InlineProblem>
        ))}
      </InnerContent>
      <SelectedProblemsDisplay problems={problems.filter((problem) => problem.selected)} />

      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}

export default ProblemSelector;
