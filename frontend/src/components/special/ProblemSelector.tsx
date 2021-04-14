import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { DifficultyDisplayButton } from '../core/Button';

const InlineProblem = styled.div`
  width: 300px;
  height: 50px;
`;

const ProblemName = styled.div`
  background: blue;
`;

function ProblemSelector() {
  const [error, setError] = useState<string>('');
  const [problems, setProblems] = useState<SelectableProblem[]>([]);

  useEffect(() => {
    getProblems()
      .then((res) => {
        setProblems(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      {problems.map((problem) => (
        <InlineProblem>
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

      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}

export default ProblemSelector;
