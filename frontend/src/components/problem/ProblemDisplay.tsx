import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import {
  deleteProblem,
  Problem,
  ProblemIOType,
  problemIOTypeToString,
  TestCase,
} from '../../api/Problem';
import {
  FixedTextArea,
  PureTextInputTitle,
  TextInput,
  CheckboxInput,
} from '../core/Input';
import { Difficulty } from '../../api/Difficulty';
import {
  SmallDifficultyButton,
  PrimaryButton,
  TextButton,
  SmallButton,
} from '../core/Button';
import PrimarySelect from '../core/Select';
import { SmallHeaderText, LowMarginMediumText, Text } from '../core/Text';
import Loading from '../core/Loading';
import ErrorMessage from '../core/Error';
import { ThemeConfig } from '../config/Theme';
import { SmallButtonLink } from '../core/Link';
import { FlexBareContainer } from '../core/Container';

const MainContent = styled.div`
  text-align: left;
  padding: 20px;
  flex: 6;
`;

const SidebarContent = styled.div`
  text-align: left;
  padding: 20px;
  flex: 4;
`;

const SettingsContainer = styled.div<any>`
  text-align: left;
  margin: 0.25rem 0 1rem 0;
  padding: ${({ padding }) => padding || '1rem'};
  border-radius: 10px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background: ${({ theme }) => theme.colors.white};
`;

const MarginRightContainer = styled.div<any>`
  margin-right: ${({ marginRight }) => marginRight}%;
`;

type ProblemDisplayParams = {
  problem: Problem,
  actionText: string,
  onClick: (newProblem: Problem) => void,
  editMode: boolean,
};

// a little function to help us with reordering the result
const reorder = (list: TestCase[], startIndex: number, endIndex: number): TestCase[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function ProblemDisplay(props: ProblemDisplayParams) {
  const {
    problem, onClick, actionText, editMode,
  } = props;

  const history = useHistory();
  const [newProblem, setNewProblem] = useState<Problem>(problem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newTestCases: TestCase[] = reorder(
      newProblem.testCases,
      result.source.index,
      result.destination.index,
    );

    const updatedProblem: Problem = newProblem;
    updatedProblem.testCases = newTestCases;

    setNewProblem(updatedProblem);
  };

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
    <>
      <MainContent>
        <FlexBareContainer>
          <SmallHeaderText>Problem</SmallHeaderText>
          <SmallButtonLink
            color={ThemeConfig.colors.gradients.gray}
            onClick={() => onClick(newProblem)}
            to="/problems/all"
            style={{ marginLeft: 'auto' }}
          >
            Back
          </SmallButtonLink>
          <SmallButton
            color={ThemeConfig.colors.gradients.blue}
            onClick={() => onClick(newProblem)}
          >
            {actionText}
          </SmallButton>
        </FlexBareContainer>
        <SettingsContainer padding="3rem">
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
        </SettingsContainer>

        {editMode
          ? (
            <>
              <SmallHeaderText>Test Cases</SmallHeaderText>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(providedDroppable) => (
                    <div
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {newProblem.testCases.map((testCase, index) => (
                        // eslint-disable-next-line max-len
                        <Draggable key={testCase.input} draggableId={testCase.input} index={index}>
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              style={providedDraggable.draggableProps.style}
                            >
                              <SettingsContainer style={{ position: 'relative' }}>
                                <Text style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '5%',
                                  margin: 0,
                                  fontWeight: 700,
                                  fontSize: '1.5rem',
                                }}
                                >
                                  {index + 1}
                                </Text>
                                <FlexBareContainer>
                                  <MarginRightContainer marginRight="10">
                                    <Text style={{ marginTop: 0 }}>Input</Text>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].input}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index, e.target.value,
                                          current.output, current.hidden, current.explanation);
                                      }}
                                    />
                                  </MarginRightContainer>
                                  <MarginRightContainer marginRight="5" style={{ marginLeft: 'auto' }}>
                                    <Text style={{ marginTop: 0 }}>Output</Text>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].output}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index, current.input, e.target.value,
                                          current.hidden, current.explanation);
                                      }}
                                    />
                                  </MarginRightContainer>
                                </FlexBareContainer>

                                <FlexBareContainer style={{ marginBottom: '10px' }}>
                                  <MarginRightContainer marginRight="5" style={{ flex: 2 }}>
                                    <Text>Explanation</Text>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].explanation}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index, current.input, current.output,
                                          current.hidden, e.target.value);
                                      }}
                                    />
                                  </MarginRightContainer>
                                </FlexBareContainer>

                                <FlexBareContainer>
                                  <MarginRightContainer marginRight="5">
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
                                  </MarginRightContainer>

                                  <MarginRightContainer marginRight="5" style={{ marginLeft: 'auto' }}>
                                    <TextButton
                                      color={ThemeConfig.colors.red2}
                                      onClick={() => deleteTestCase(index)}
                                    >
                                      Delete
                                    </TextButton>
                                  </MarginRightContainer>
                                </FlexBareContainer>
                              </SettingsContainer>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <SmallButton
                style={{ display: 'block' }}
                color={ThemeConfig.colors.gradients.green}
                onClick={addTestCase}
              >
                Add
              </SmallButton>
            </>
          ) : null}

        {loading ? <Loading /> : null}
        {error ? <ErrorMessage message={error} /> : null}
      </MainContent>
      <SidebarContent>
        <SmallHeaderText>Options</SmallHeaderText>
        <SettingsContainer>
          <LowMarginMediumText>Difficulty</LowMarginMediumText>
          {Object.keys(Difficulty).map((key) => {
            const difficulty = Difficulty[key as keyof typeof Difficulty];
            if (difficulty !== Difficulty.Random) {
              return (
                <SmallDifficultyButton
                  difficulty={difficulty || Difficulty.Random}
                  onClick={() => handleEnumChange('difficulty', difficulty)}
                  active={difficulty === newProblem.difficulty}
                  enabled
                >
                  {key}
                </SmallDifficultyButton>
              );
            }
            return null;
          })}

          <LowMarginMediumText>Problem Inputs</LowMarginMediumText>
          {newProblem.problemInputs.map((input, index) => (
            <div style={{ marginBottom: '5px' }}>
              <TextInput
                value={newProblem.problemInputs[index].name}
                onChange={(e) => handleInputChange(index,
                  e.target.value, newProblem.problemInputs[index].type)}
              />

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

              <TextButton
                style={{
                  display: 'inline-block',
                  marginLeft: '2.5px',
                }}
                color={ThemeConfig.colors.gray}
                onClick={() => deleteProblemInput(index)}
              >
                ✕
              </TextButton>
            </div>
          ))}
          <TextButton
            color={ThemeConfig.colors.gray}
            onClick={addProblemInput}
          >
            Add +
          </TextButton>

          <LowMarginMediumText>Problem Output</LowMarginMediumText>
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
                <LowMarginMediumText>Danger Zone</LowMarginMediumText>
                <PrimaryButton
                  style={{ margin: '0 0 1rem 0' }}
                  color={ThemeConfig.colors.gradients.red}
                  onClick={deleteProblemFunc}
                >
                  Delete Problem
                </PrimaryButton>
              </>
            )
            : null}
        </SettingsContainer>
      </SidebarContent>
    </>
  );
}

export default ProblemDisplay;
