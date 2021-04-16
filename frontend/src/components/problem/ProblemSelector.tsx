import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { InlineDifficultyDisplayButton } from '../core/Button';
import { TextInput } from '../core/Input';

type ProblemSelectorProps = {
  selectedProblems: SelectableProblem[],
  onSelect: (newlySelected: SelectableProblem) => void,
};

type ContentProps = {
  show: boolean,
};

const Content = styled.div`
  width: 65%;
  min-width: 250px;
  margin: 10px 0;
`;

const InnerContent = styled.div<ContentProps>`
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
  display: ${({ show }) => (show ? 'block' : 'none')};
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
`;

const InlineProblem = styled.div`
  width: 100%;
  padding: 8px 15px;
  display: flex;
  flex: auto;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: solid 1px ${({ theme }) => theme.colors.background};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ClickableInlineDifficultyDisplayButton = styled(InlineDifficultyDisplayButton)`
  &:hover {
    cursor: pointer;
  }
`;

const ProblemSearch = styled(TextInput)`
  width: 100%;
  margin: 0;
`;

const ProblemName = styled.p`
  font-weight: bold;
  margin: 0;
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
    getProblems(true)
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
    <Content>
      <ProblemSearch
        onClick={() => setShowProblems(!showProblems)}
        onChange={setSearchStatus}
        placeholder={problems.length ? 'Select problems (optional)' : 'Loading...'}
      />

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
              key={problem.problemId}
              onClick={() => setSelectedStatus(index)}
            >
              <ProblemName>
                {problem.name}
              </ProblemName>
              <ClickableInlineDifficultyDisplayButton
                difficulty={problem.difficulty}
                enabled={false}
                active
              >
                {displayNameFromDifficulty(problem.difficulty)}
              </ClickableInlineDifficultyDisplayButton>
            </InlineProblem>
          );
        })}
      </InnerContent>

      { error ? <ErrorMessage message={error} /> : null }
    </Content>
  );
}

export default ProblemSelector;
