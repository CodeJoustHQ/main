import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import {
  deleteProblem,
  Problem,
  ProblemIOType,
  problemIOTypeToString,
} from '../../api/Problem';
import {
  ConsoleTextArea,
  PureTextInputTitle,
  TextInput,
  CheckboxInput,
} from '../core/Input';
import { Difficulty } from '../../api/Difficulty';
import {
  DifficultyButton,
  PrimaryButton,
  SmallButton,
} from '../core/Button';
import PrimarySelect from '../core/Select';
import { SmallHeaderText, MediumText, Text } from '../core/Text';
import Loading from '../core/Loading';
import ErrorMessage from '../core/Error';
import { ThemeConfig } from '../config/Theme';
import { PrimaryButtonLink } from '../core/Link';

const Content = styled.div`
  text-align: left;
  padding: 10px;
`;

const TitleDescriptionContainer = styled.div`
  text-align: left;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background: ${({ theme }) => theme.colors.white};
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

  const history = useHistory();
  const [newProblem, setNewProblem] = useState<Problem>(problem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deleteProblemFunc = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }

    setLoading(true);
    setError('');

    deleteProblem(newProblem.problemId)
      .then(() => {
        setLoading(false);
        history.replace('/problems/all');
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

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

  // Handle description change
  const handleDescriptionChange = (value: string) => handleChange({ target: { name: 'description', value } });

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
  const handleTestCaseChange = (index: number, input: string,
    output: string, hidden: boolean, explanation: string) => {
    setNewProblem({
      ...newProblem,
      testCases: newProblem.testCases.map((testCase, i) => {
        if (index === i) {
          return {
            input,
            output,
            hidden,
            explanation,
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
      <SmallHeaderText>Problem</SmallHeaderText>
      <PrimaryButton
        fontWeight="700"
        width="8vw"
        color={ThemeConfig.colors.gradients.blue}
        onClick={() => onClick(newProblem)}
      >
        {actionText}
      </PrimaryButton>
      <PrimaryButtonLink
        fontWeight="700"
        width="8vw"
        color={ThemeConfig.colors.gradients.gray}
        onClick={() => onClick(newProblem)}
        to="/problems/all"
      >
        Back
      </PrimaryButtonLink>
      <TitleDescriptionContainer>
        <PureTextInputTitle
          placeholder="Write a nice title"
          name="name"
          value={newProblem.name}
          onChange={handleChange}
        />
        <hr style={{ margin: '1rem 0' }} />
        <MarkdownEditor
          placeholder="Write a nice description"
          defaultValue={newProblem.description}
          onChange={(getNewValue) => handleDescriptionChange(getNewValue())}
        />
      </TitleDescriptionContainer>

      <SmallHeaderText>Options</SmallHeaderText>
      <MediumText>Difficulty</MediumText>
      {Object.keys(Difficulty).map((key) => {
        const difficulty = Difficulty[key as keyof typeof Difficulty];
        if (difficulty !== Difficulty.Random) {
          return (
            <DifficultyButton
              difficulty={difficulty || Difficulty.Random}
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

      <MediumText>Problem Inputs</MediumText>
      {newProblem.problemInputs.map((input, index) => (
        <div>
          <TextInput
            value={newProblem.problemInputs[index].name}
            onChange={(e) => handleInputChange(index,
              e.target.value, newProblem.problemInputs[index].type)}
          />
          <br />

          <PrimarySelect
            onChange={(e) => handleInputChange(
              index,
              newProblem.problemInputs[index].name,
              ProblemIOType[e.target.value as keyof typeof ProblemIOType],
            )}
            value={problemIOTypeToString(newProblem.problemInputs[index].type)}
          >
            {
              Object.keys(ProblemIOType).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))
            }
          </PrimarySelect>

          <SmallButton onClick={() => deleteProblemInput(index)}>Delete Input</SmallButton>
        </div>
      ))}
      <SmallButton onClick={addProblemInput}>Add Input</SmallButton>

      <MediumText>Problem Output</MediumText>
      <PrimarySelect
        onChange={(e) => handleEnumChange('outputType', ProblemIOType[e.target.value as keyof typeof ProblemIOType])}
        value={problemIOTypeToString(newProblem.outputType)}
      >
        {
          Object.keys(ProblemIOType).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))
        }
      </PrimarySelect>

      {editMode
        ? (
          <>
            <MediumText>Danger Zone</MediumText>
            <PrimaryButton
              fontWeight="700"
              width="12vw"
              color={ThemeConfig.colors.gradients.red}
              onClick={deleteProblemFunc}
            >
              Delete Problem
            </PrimaryButton>
          </>
        )
        : null}

      {editMode
        ? (
          <div>
            <MediumText>Test Cases:</MediumText>
            {newProblem.testCases.map((testCase, index) => (
              <div>
                <Text>Input</Text>
                <ConsoleTextArea
                  value={newProblem.testCases[index].input}
                  onChange={(e) => {
                    const current = newProblem.testCases[index];
                    handleTestCaseChange(index, e.target.value,
                      current.output, current.hidden, current.explanation);
                  }}
                />
                <br />
                <Text>Output</Text>
                <TextInput
                  value={newProblem.testCases[index].output}
                  onChange={(e) => {
                    const current = newProblem.testCases[index];
                    handleTestCaseChange(index, current.input, e.target.value,
                      current.hidden, current.explanation);
                  }}
                />

                <Text>Explanation</Text>
                <TextInput
                  value={newProblem.testCases[index].explanation}
                  onChange={(e) => {
                    const current = newProblem.testCases[index];
                    handleTestCaseChange(index, current.input, current.output,
                      current.hidden, e.target.value);
                  }}
                />

                <label htmlFor={`problem-hidden-${index}`}>
                  Hidden
                  <CheckboxInput
                    id={`problem-hidden-${index}`}
                    checked={newProblem.testCases[index].hidden}
                    onChange={(e) => {
                      const current = newProblem.testCases[index];
                      handleTestCaseChange(index, current.input,
                        current.output, e.target.checked, current.explanation);
                    }}
                  />
                </label>

                <SmallButton onClick={() => deleteTestCase(index)}>Delete Test Case</SmallButton>
              </div>
            ))}
            <SmallButton onClick={addTestCase}>Add Test Case</SmallButton>
          </div>
        ) : null}

      {loading ? <Loading /> : null}
      {error ? <ErrorMessage message={error} /> : null}
    </Content>
  );
}

export default ProblemDisplay;
