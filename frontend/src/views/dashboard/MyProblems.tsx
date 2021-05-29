import React, { useState } from 'react';
import styled from 'styled-components';
import { MainHeaderText, SecondaryHeaderText } from '../../components/core/Text';
import ProblemCard from '../../components/card/ProblemCard';
import { GreenSmallButtonLink, TextLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';
import {
  CenteredContainer,
  FlexHorizontalContainer,
  FlexLeft,
  RelativeContainer,
} from '../../components/core/Container';
import { TextButton } from '../../components/core/Button';
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

const CreateButtonLink = styled(GreenSmallButtonLink)`
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
            <CreateButtonLink to="/problem/create">
              Create
            </CreateButtonLink>
          </RelativeContainer>
        </FlexHorizontalContainer>
      </TopText>

      <FilterContainer>
        <FilterInput
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter (by name, difficulty, tag, etc.)"
        />
        <WhiteTextButton onClick={() => setFilterText('')}>✕</WhiteTextButton>
      </FilterContainer>

      {account?.problems.map((problem: Problem, index) => {
        const text = filterText.toLowerCase();

        // Filter by name, difficulty, and tags
        if (filterText
          && !problem.name.toLowerCase().includes(text)
          && !problem.difficulty.toLowerCase().includes(text)
          && !problem.problemTags.some((tag) => tag.name.toLowerCase().includes(text))) {
          return null;
        }

        return (
          <ProblemCard
            key={index}
            problem={problem}
          />
        );
      })}

      {!loading && !account?.problems.length ? (
        <CenteredContainer>
          <SecondaryHeaderText>
            You have not written any problems. Create your first or browse our public collection!
          </SecondaryHeaderText>
        </CenteredContainer>
      ) : null}
    </Content>
  );
}

export default MyProblems;
