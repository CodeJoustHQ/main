import React from 'react';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import { TextInput } from '../core/Input';

const Content = styled.div`
  padding: 10px;
`;

type ProblemDisplayParams = {
  problem: Problem,
};

function ProblemDisplay(props: ProblemDisplayParams) {
  const { problem } = props;

  return (
    <Content>
      Name:
      <TextInput
        value={problem.name}
        onChange={(e) => { problem.name = e.target.value; }}
      />

      Description:
      <TextInput
        value={problem.description}
        onChange={(e) => { problem.description = e.target.value; }}
      />
    </Content>
  );
}

export default ProblemDisplay;
