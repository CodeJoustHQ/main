import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { DifficultyDisplayButton } from '../core/Button';

type ContentProps = {
  show: boolean,
};

const InnerContent = styled.div<ContentProps>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  border-radius: 5px;
`;

const InlineProblem = styled.div`
  width: 300px;
  height: 50px;
  display: flex;
  flex: auto;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};
  
  border: solid 1px ${({ theme }) => theme.colors.gray};
`;

const ProblemName = styled.p`
  font-weight: bold;
`;

function ProblemSelector() {
  const [error, setError] = useState<string>('');
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

  return (
    <div>
      <button onClick={() => setShowProblems(!showProblems)}>Select a problem...</button>
      <InnerContent show={showProblems}>
        {problems.map((problem) => (
          <InlineProblem key={problem.name}>
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

      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}

export default ProblemSelector;
