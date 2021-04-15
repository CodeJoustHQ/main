import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { DifficultyDisplayButton } from '../core/Button';
import { TextInput } from '../core/Input';

type ProblemSelectorProps = {
  selectedProblems: SelectableProblem[],
  onSelect: (newlySelected: SelectableProblem) => void,
};

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
  
  border: solid 1px ${({ theme }) => theme.colors.gray};
  
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

const ProblemSearch = styled(TextInput)`
  ;
`;

const ProblemName = styled.p`
  font-weight: bold;
`;

function ProblemSelector(props: ProblemSelectorProps) {
  const { selectedProblems, onSelect } = props;

  const [error, setError] = useState('');
  const [problems, setProblems] = useState<SelectableProblem[]>([]);
  const [showProblems, setShowProblems] = useState(false);
  const [searchText, setSearchText] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  // Close list of problems if clicked outside of div
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current!.contains(e.target as Node)) {
        setShowProblems(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  useEffect(() => {
    getProblems()
      .then((res) => {
        setProblems(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const setSelectedStatus = (index: number) => {
    setShowProblems(false);
    onSelect(problems[index]);
  };

  const setSearchStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <ProblemSearch onClick={() => setShowProblems(!showProblems)} onChange={setSearchStatus} />
      <InnerContent show={showProblems} ref={ref}>
        {problems.map((problem, index) => {
          // Only show problems that haven't been selected yet
          if (selectedProblems.some((p) => p.problemId === problem.problemId)) {
            return null;
          }

          if (searchText && !problem.name.toLowerCase().includes(searchText.toLowerCase())) {
            return null;
          }

          return (
            <InlineProblem
              key={problem.name}
              onClick={() => setSelectedStatus(index)}
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
          );
        })}
      </InnerContent>

      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}

export default ProblemSelector;
