import React, { useState } from 'react';
import styled from 'styled-components';
import { Problem, ProblemIOType } from '../../api/Problem';
import { LargeInputButton, TextInput } from '../core/Input';
import Difficulty from '../../api/Difficulty';
import { DifficultyButton } from '../core/Button';

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

  //   difficulty: Difficulty,
  //   testCases: TestCase[],
  //   problemInputs: ProblemInput[],
  //   outputType: ProblemIOType,

  const handleChange = (e: any) => {
    const { name, value } = e.target;
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

      {Object.keys(Difficulty).map((key) => {
        const difficulty = Difficulty[key as keyof typeof Difficulty];
        if (difficulty !== Difficulty.Random) {
          return (
            <DifficultyButton
              onClick={() => handleChange({ target: 'difficulty', value: difficulty })}
              active={difficulty === problem.difficulty}
              enabled
            >
              {key}
            </DifficultyButton>
          );
        }
        return null;
      })}

      {Object.keys(ProblemIOType).map((key) => {
        const outputType = ProblemIOType[key as keyof typeof ProblemIOType];
        return (
          <DifficultyButton
            onClick={() => handleChange({ target: 'outputType', value: outputType })}
            active={outputType === problem.outputType}
            enabled
          >
            {key}
          </DifficultyButton>
        );
      })}

      <LargeInputButton value="Edit Problem" onClick={() => onClick(newProblem)} />
    </Content>
  );
}

export default ProblemDisplay;
