import React, { useState } from 'react';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import ProblemCard from '../card/ProblemCard';
import { TextInput } from '../core/Input';
import { TextButton } from '../core/Button';
import { problemMatchesFilterText } from '../../util/Utility';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;

  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  height: 35px;
  margin: 15px 10px 25px 10px;
  padding: 4px;
`;

const FilterInput = styled(TextInput)`
  flex-grow: 2;
  border: none;
  border-radius: 5px;
  
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  
  &:focus {
    outline: none;
    border: none;
  }
`;

const WhiteTextButton = styled(TextButton)`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  margin-right: 8px;
`;

type FilteredProblemListProps = {
  problems: Problem[],
};

function FilteredProblemList(props: FilteredProblemListProps) {
  const { problems } = props;

  const [filterText, setFilterText] = useState('');

  return (
    <>
      <FilterContainer>
        <FilterInput
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by name, difficulty, or tag (separate queries by comma)"
        />
        {filterText ? <WhiteTextButton onClick={() => setFilterText('')}>✕</WhiteTextButton> : null}
      </FilterContainer>

      {problems.map((problem: Problem) => {
        if (!problemMatchesFilterText(problem, filterText)) {
          return null;
        }

        return (
          <ProblemCard
            key={problem.problemId}
            problem={problem}
          />
        );
      })}
    </>
  );
}

export default FilteredProblemList;
