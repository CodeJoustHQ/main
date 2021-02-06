import React from 'react';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import { Text } from '../core/Text';
import {
  CenteredContainer, FlexHorizontalContainer, FlexLeft, FlexRight,
} from '../core/Container';

type ProblemCardProps = {
  problem: Problem,
};

const Content = styled.div`
  display: block;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
`;

function ProblemCard(props: ProblemCardProps) {
  const { problem } = props;

  return (
    <Content>
      <FlexHorizontalContainer>
        <FlexLeft>
          <CenteredContainer>
            <Text bold>{problem.name}</Text>
            <br />
            <Text>{problem.description.substring(0, 50)}</Text>
          </CenteredContainer>
        </FlexLeft>

        <FlexRight>
          <CenteredContainer>
            <Text>{problem.problemId}</Text>
            <br />
            <Text>{problem.difficulty}</Text>
          </CenteredContainer>
        </FlexRight>
      </FlexHorizontalContainer>
    </Content>
  );
}

export default ProblemCard;
