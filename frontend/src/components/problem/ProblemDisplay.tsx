import React, { useState } from 'react';
import styled from 'styled-components';
import { Problem, ProblemIOType } from '../../api/Problem';
import { LargeInputButton, TextInput } from '../core/Input';
import Difficulty from '../../api/Difficulty';
import { DifficultyButton, ProblemIOTypeButton, SmallButton } from '../core/Button';
import { MediumText, Text } from '../core/Text';

const Content = styled.div`
  padding: 10px;
`;

type ProblemDisplayParams = {
  problem: Problem,
  actionText: string,
  onClick: (newProblem: Problem) => void,
  editMode: boolean,
};

function ProblemDisplay(props: ProblemDisplayParams) {
  const {
    problem, onClick, actionText, editMode,
  } = props;
  const [newProblem, setNewProblem] = useState<Problem>(problem);

  // Handle updating of normal text fields
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewProblem({
      ...newProblem,
      [name]: value,
    });
  };

  // Handle updating of enum-type fields
  const handleEnumChange = (name: string, value: any) => handleChange({ target: { name, value } });

  // Handle updating of problem inputs
  const handleInputChange = (index: number, name: string, type: ProblemIOType) => {
    setNewProblem({
      ...newProblem,
      problemInputs: newProblem.problemInputs.map((input, i) => {
        if (index === i) {
          return { name, type };
        }
        return input;
      }),
    });
  };

  // Handle adding a new problem input for this problem
  const addProblemInput = () => {
    setNewProblem({
      ...newProblem,
      problemInputs: [...newProblem.problemInputs, { name: 'name', type: ProblemIOType.Integer }],
    });
  };

  // Handle deleting a problem input for this problem
  const deleteProblemInput = (index: number) => {
    setNewProblem({
      ...newProblem,
      problemInputs: newProblem.problemInputs.filter((_, i) => index !== i),
    });
  };

  // Handle updating of test case
  const handleTestCaseChange = (index: number, input: string, output: string) => {
    setNewProblem({
      ...newProblem,
      testCases: newProblem.testCases.map((testCase, i) => {
        if (index === i) {
          return {
            input,
            output,
            hidden: false,
            explanation: '',
          };
        }
        return testCase;
      }),
    });
  };

  // Handle adding a new test case for this problem
  const addTestCase = () => {
    setNewProblem({
      ...newProblem,
      testCases: [...newProblem.testCases, {
        input: '0', output: '0', hidden: false, explanation: '',
      }],
    });
  };

  // Handle deleting a test case for this problem
  const deleteTestCase = (index: number) => {
    setNewProblem({
      ...newProblem,
      testCases: newProblem.testCases.filter((_, i) => index !== i),
    });
  };

  return (
    <Content>
      <MediumText>Name:</MediumText>
      <TextInput
        name="name"
        value={newProblem.name}
        onChange={handleChange}
      />

      <MediumText>Description:</MediumText>
      <TextInput
        name="description"
        value={newProblem.description}
        onChange={handleChange}
      />

      <MediumText>Difficulty:</MediumText>
      {Object.keys(Difficulty).map((key) => {
        const difficulty = Difficulty[key as keyof typeof Difficulty];
        if (difficulty !== Difficulty.Random) {
          return (
            <DifficultyButton
              onClick={() => handleEnumChange('difficulty', difficulty)}
              active={difficulty === newProblem.difficulty}
              enabled
            >
              {key}
            </DifficultyButton>
          );
        }
        return null;
      })}

      <MediumText>Problem Inputs:</MediumText>
      <SmallButton onClick={addProblemInput}>Add Input</SmallButton>
      {newProblem.problemInputs.map((input, index) => (
        <div>
          <Text bold>{`Input ${index + 1}`}</Text>
          <TextInput
            value={newProblem.problemInputs[index].name}
            onChange={(e) => handleInputChange(index,
              e.target.value, newProblem.problemInputs[index].type)}
          />

          {Object.keys(ProblemIOType).map((key) => {
            const inputType = ProblemIOType[key as keyof typeof ProblemIOType];
            return (
              <ProblemIOTypeButton
                onClick={() => handleInputChange(index,
                  newProblem.problemInputs[index].name, inputType)}
                active={inputType === newProblem.problemInputs[index].type}
              >
                {key}
              </ProblemIOTypeButton>
            );
          })}
          <SmallButton onClick={() => deleteProblemInput(index)}>Delete Input</SmallButton>
        </div>
      ))}

      <MediumText>Output Type:</MediumText>
      {Object.keys(ProblemIOType).map((key) => {
        const outputType = ProblemIOType[key as keyof typeof ProblemIOType];
        return (
          <ProblemIOTypeButton
            onClick={() => handleEnumChange('outputType', outputType)}
            active={outputType === newProblem.outputType}
          >
            {key}
          </ProblemIOTypeButton>
        );
      })}

      {editMode
        ? (
          <div>
            <MediumText>Test Cases:</MediumText>
            <SmallButton onClick={addTestCase}>Add Test Case</SmallButton>
            {newProblem.testCases.map((testCase, index) => (
              <div>
                <Text bold>{`Test Case ${index + 1}`}</Text>
                <TextInput
                  value={newProblem.testCases[index].input}
                  onChange={(e) => handleTestCaseChange(index,
                    e.target.value, newProblem.testCases[index].output)}
                />
                <TextInput
                  value={newProblem.testCases[index].output}
                  onChange={(e) => handleTestCaseChange(index,
                    newProblem.testCases[index].input, e.target.value)}
                />
                <SmallButton onClick={() => deleteTestCase(index)}>Delete Test Case</SmallButton>
              </div>
            ))}
          </div>
        ) : null}

      <LargeInputButton value={actionText} onClick={() => onClick(newProblem)} />
    </Content>
  );
}

export default ProblemDisplay;
