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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log({
      ...newProblem,
      [name]: value,
    });
    setNewProblem({
      ...newProblem,
      [name]: value,
    });
  };

  return (
    <Content>
      Name:
      <TextInput
        name="name"
        value={newProblem.name}
        onChange={handleChange}
      />

      Description:
      <TextInput
        name="description"
        value={newProblem.description}
        onChange={handleChange}
      />

      <LargeInputButton value="Edit Problem" onClick={() => onClick(newProblem)} />
    </Content>
  );
}

export default ProblemDisplay;
