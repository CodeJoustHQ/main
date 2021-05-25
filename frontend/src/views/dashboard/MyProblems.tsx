import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { MainHeaderText } from '../../components/core/Text';
import ProblemCard from '../../components/card/ProblemCard';
import { TextLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';
import { FlexHorizontalContainer, FlexLeft, RelativeContainer } from '../../components/core/Container';
import { GreenSmallButton, TextButton } from '../../components/core/Button';
import { TextInput } from '../../components/core/Input';
import { Problem } from '../../api/Problem';

type MyProblemsProps = {
  loading: boolean,
};

const Content = styled.div`
  text-align: left;
`;

const TopText = styled.div`
  padding: 0 10px;
`;

const MyProblemsText = styled(MainHeaderText)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.darkText};
  margin: 0;
`;

const CreateButton = styled(GreenSmallButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

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

function MyProblems(props: MyProblemsProps) {
  const { loading } = props;

  const history = useHistory();
  const { account } = useAppSelector((state) => state.account);
  const [filterText, setFilterText] = useState('');

  return (
    <Content>
      <TopText>
        <FlexHorizontalContainer>
          <FlexLeft>
            <div>
              <MyProblemsText>My Problems</MyProblemsText>
              <TextLink to="/problems/all">
                Or browse our public collection &#8594;
              </TextLink>
            </div>
          </FlexLeft>
          <RelativeContainer>
            <CreateButton onClick={() => history.push('/problem/create')}>
              Create
            </CreateButton>
          </RelativeContainer>
        </FlexHorizontalContainer>
      </TopText>

      <FilterContainer>
        <FilterInput
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter (by name, difficulty, tag, etc.)"
        />
        <WhiteTextButton>✕</WhiteTextButton>
      </FilterContainer>

      {account?.problems.map((problem: Problem, index) => {
        // Filter by name and difficulty
        if (filterText
          && !problem.name.toLowerCase().includes(filterText.toLowerCase())
          && !problem.difficulty.toLowerCase().includes(filterText.toLowerCase())) {
          // TODO: tags, after merging
          return null;
        }

        return (
          <ProblemCard
            key={index}
            problem={problem}
            onClick={() => history.push(`/problem/${problem.problemId}`)}
          />
        );
      })}

      {!loading && !account?.problems.length ? (
        <>
          <p>You do not have any problems.</p>
          <TextLink to="/problem/create">
            Create one now &#8594;
          </TextLink>
        </>
      ) : null}
    </Content>
  );
}

export default MyProblems;
