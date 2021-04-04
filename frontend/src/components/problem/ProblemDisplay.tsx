import React, { useEffect, useState } from 'react';
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
  RedTextButton,
  GrayTextButton,
  SmallButton,
  GreenSmallButtonBlock,
  ToggleButtonLabel,
  ToggleButtonInput,
  ToggleButtonSpan,
} from '../core/Button';
import PrimarySelect from '../core/Select';
import {
  SmallHeaderText,
  LowMarginMediumText,
  Text,
  LabelAbsoluteText,
} from '../core/Text';
import Loading from '../core/Loading';
import ErrorMessage from '../core/Error';
import { InvertedSmallButtonLink } from '../core/Link';
import { FlexBareContainer } from '../core/Container';
import { generateRandomId } from '../../util/Utility';

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

const TopButtonsContainer = styled.div`
  margin-left: auto;
`;

const SettingsContainer = styled.div`
  text-align: left;
  margin: 0.25rem 0 1rem 0;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12);
  background: ${({ theme }) => theme.colors.white};
`;

const SettingsContainerRelative = styled(SettingsContainer)`
  position: relative;
`;

const SettingsContainerHighPadding = styled(SettingsContainer)`
  padding: 3rem;
`;

const FlexBareContainerMarginBottom = styled(FlexBareContainer)`
  margin-bottom: 10px;
`;

const TitleDescriptionSeparator = styled.hr`
  margin: 1rem 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InputContainer = styled.div`
  margin-right: 10%;
`;

const HiddenContainer = styled.div`
  margin-right: 5%;
`;

const ExplanationContainer = styled.div`
  margin-right: 5%;
  flex: 2;
`;

const MarginLeftRightAutoContainer = styled.div`
  margin-right: 5%;
  margin-left: auto;
`;

const StyledMarkdownEditor = styled(MarkdownEditor)`
  p {
    font-family: ${({ theme }) => theme.font};
  }

  // The specific list of attributes to have dark text color.
  .ProseMirror > p, blockquote, h1, h2, h3, ul, ol, table {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const NoMarginTopText = styled(Text)`
  margin-top: 0px;
`;

const InputTypeContainer = styled.div`
  margin-bottom: 5px;
`;

const CancelTextButton = styled(TextButton)`
  margin-left: 2.5px;
  color: ${({ theme }) => theme.colors.gray};
`;

const DeleteButton = styled(PrimaryButton)`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.red2};
  background: ${({ theme }) => theme.colors.white};
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
  const [problemApproval, setProblemApproval] = useState(false);
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

    setNewProblem({ ...newProblem, testCases: newTestCases });
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

  // Toggle the problem approval status
  const toggleProblemApproval = () => {
    if (problemApproval) {
      setProblemApproval(false);
    } else {
      setProblemApproval(true);
    }
  };

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
  const handleTestCaseChange = (index: number, id: string, input: string,
    output: string, hidden: boolean, explanation: string) => {
    setNewProblem({
      ...newProblem,
      testCases: newProblem.testCases.map((testCase, i) => {
        if (index === i) {
          return {
            id,
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
        id: generateRandomId(), input: '0', output: '0', hidden: false, explanation: '',
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
          <TopButtonsContainer>
            <InvertedSmallButtonLink
              onClick={() => onClick(newProblem)}
              to="/problems/all"
            >
              Back
            </InvertedSmallButtonLink>
            <SmallButton
              onClick={() => onClick(newProblem)}
            >
              {actionText}
            </SmallButton>
          </TopButtonsContainer>
        </FlexBareContainer>
        <SettingsContainerHighPadding>
          <PureTextInputTitle
            placeholder="Write a nice title"
            name="name"
            value={newProblem.name}
            onChange={handleChange}
          />
          <TitleDescriptionSeparator />
          <StyledMarkdownEditor
            placeholder="Write a nice description"
            defaultValue={newProblem.description}
            onChange={(getNewValue) => handleDescriptionChange(getNewValue())}
          />
        </SettingsContainerHighPadding>

        {editMode
          ? (
            <>
              <SmallHeaderText>Test Cases</SmallHeaderText>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(providedDroppable: any) => (
                    <div
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {newProblem.testCases.map((testCase, index) => (
                        <Draggable key={testCase.id} draggableId={testCase.id} index={index}>
                          {(providedDraggable: any) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              style={providedDraggable.draggableProps.style}
                            >
                              <SettingsContainerRelative>
                                <LabelAbsoluteText>
                                  #
                                  {index + 1}
                                </LabelAbsoluteText>
                                <FlexBareContainer>
                                  <InputContainer>
                                    <NoMarginTopText>Input</NoMarginTopText>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].input}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index, current.id, e.target.value,
                                          current.output, current.hidden, current.explanation);
                                      }}
                                    />
                                  </InputContainer>
                                  <MarginLeftRightAutoContainer>
                                    <NoMarginTopText>Output</NoMarginTopText>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].output}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index, current.id,
                                          current.input, e.target.value,
                                          current.hidden, current.explanation);
                                      }}
                                    />
                                  </MarginLeftRightAutoContainer>
                                </FlexBareContainer>

                                <FlexBareContainerMarginBottom>
                                  <ExplanationContainer>
                                    <Text>Explanation</Text>
                                    <FixedTextArea
                                      value={newProblem.testCases[index].explanation}
                                      onChange={(e) => {
                                        const current = newProblem.testCases[index];
                                        handleTestCaseChange(index,
                                          current.id, current.input,
                                          current.output, current.hidden,
                                          e.target.value);
                                      }}
                                    />
                                  </ExplanationContainer>
                                </FlexBareContainerMarginBottom>

                                <FlexBareContainer>
                                  <HiddenContainer>
                                    <label htmlFor={`problem-hidden-${index}`}>
                                      Hidden
                                      <CheckboxInput
                                        id={`problem-hidden-${index}`}
                                        checked={newProblem.testCases[index].hidden}
                                        onChange={(e) => {
                                          const current = newProblem.testCases[index];
                                          handleTestCaseChange(index,
                                            current.id, current.input,
                                            current.output, e.target.checked, current.explanation);
                                        }}
                                      />
                                    </label>
                                  </HiddenContainer>

                                  <MarginLeftRightAutoContainer>
                                    <RedTextButton
                                      onClick={() => deleteTestCase(index)}
                                    >
                                      Delete
                                    </RedTextButton>
                                  </MarginLeftRightAutoContainer>
                                </FlexBareContainer>
                              </SettingsContainerRelative>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <GreenSmallButtonBlock
                onClick={addTestCase}
              >
                Add
              </GreenSmallButtonBlock>
            </>
          ) : null}

        {loading ? <Loading /> : null}
        {error ? <ErrorMessage message={error} /> : null}
      </MainContent>
      <SidebarContent>
        <SmallHeaderText>Options</SmallHeaderText>
        <SettingsContainer>
          <ToggleButtonLabel>
            <ToggleButtonInput
              onChange={() => toggleProblemApproval()}
              checked={problemApproval}
            />
            <ToggleButtonSpan
              checked={problemApproval}
            />
          </ToggleButtonLabel>
          <LowMarginMediumText>Difficulty</LowMarginMediumText>
          {Object.keys(Difficulty).map((key) => {
            const difficulty = Difficulty[key as keyof typeof Difficulty];
            if (difficulty !== Difficulty.Random) {
              return (
                <SmallDifficultyButton
                  key={generateRandomId()}
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
            <InputTypeContainer>
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

              <CancelTextButton
                onClick={() => deleteProblemInput(index)}
              >
                ✕
              </CancelTextButton>
            </InputTypeContainer>
          ))}
          <GrayTextButton
            onClick={addProblemInput}
          >
            Add +
          </GrayTextButton>

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
                <DeleteButton
                  onClick={deleteProblemFunc}
                >
                  Delete Problem
                </DeleteButton>
              </>
            )
            : null}
        </SettingsContainer>
      </SidebarContent>
    </>
  );
}

export default ProblemDisplay;
