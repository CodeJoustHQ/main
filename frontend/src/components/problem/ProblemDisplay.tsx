import React, { useState } from 'react';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import { LargeInputButton, TextInput } from '../core/Input';

const Content = styled.div`
  padding: 10px;
`;

type ProblemDisplayParams = {
  problem: Problem,
  onClick: (newProblem: Problem) => void,
};

function ProblemDisplay(props: ProblemDisplayParams) {
  const { problem, onClick } = props;
  const [newProblem, setNewProblem] = useState<Problem>(problem);

  return (
    <Content>
      Name:
      <TextInput
        value={newProblem.name}
        onChange={(e) => { newProblem.name = e.target.value; }}
      />

      Description:
      <TextInput
        value={newProblem.description}
        onChange={(e) => { newProblem.description = e.target.value; }}
      />

      <LargeInputButton onClick={() => onClick(problem)} />
    </Content>
  );
}

export default ProblemDisplay;
