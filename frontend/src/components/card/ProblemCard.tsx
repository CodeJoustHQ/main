import React from 'react';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import { LargeText, SelectedItemText, Text } from '../core/Text';
import { getDifficultyDisplayButton } from '../core/Button';
import { SelectedItemContainer } from '../core/Container';
import { DivLink } from '../core/Link';

type ProblemCardProps = {
  problem: Problem,
};

const Content = styled.div`
  display: block;
  margin: 15px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
  text-align: left;
  
  &:hover {
    cursor: pointer;
  }
`;

const InnerContent = styled.div`
  padding: 15px 30px;
`;

const ProblemTagContainer = styled(SelectedItemContainer)`
  margin: 5px 10px 5px 0;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
`;

const ProblemTagText = styled(SelectedItemText)`
  font-weight: normal;
`;

const TitleText = styled(LargeText)`
  margin: 10px 12px 10px 0;
  display: inline;
  vertical-align: middle;
`;

function ProblemCard(props: ProblemCardProps) {
  const { problem } = props;

  return (
    <Content>
      <DivLink to={`/problem/${problem.problemId}`}>
        <InnerContent>
          <TitleText>{problem.name}</TitleText>
          {getDifficultyDisplayButton(problem.difficulty, true)}
          <Text>{`${problem.description.substring(0, 80)}...`}</Text>

          {problem.problemTags.map((tag) => (
            <ProblemTagContainer key={tag.name}>
              <ProblemTagText>{tag.name}</ProblemTagText>
            </ProblemTagContainer>
          ))}
        </InnerContent>
      </DivLink>
    </Content>
  );
}

export default ProblemCard;
