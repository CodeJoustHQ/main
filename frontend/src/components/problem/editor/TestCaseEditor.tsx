import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { LabelAbsoluteText, SmallHeaderText, Text } from '../../core/Text';
import { FlexBareContainer, SettingsContainer } from '../../core/Container';
import { CheckboxInput, FixedTextArea } from '../../core/Input';
import { GreenSmallButtonBlock, RedTextButton } from '../../core/Button';
import { Problem, TestCase } from '../../../api/Problem';
import { generateRandomId } from '../../../util/Utility';

const SettingsContainerRelative = styled(SettingsContainer)`
  position: relative;
`;

const FlexBareContainerMarginBottom = styled(FlexBareContainer)`
  margin-bottom: 10px;
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

const NoMarginTopText = styled(Text)`
  margin-top: 0;
`;

type TestCaseEditorProps = {
  newProblem: Problem,
  setNewProblem: (problem: Problem) => void,
};

function TestCaseEditor(props: TestCaseEditorProps) {
  const { newProblem, setNewProblem } = props;

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

  // A little function to help us with reordering the result
  const reorder = (list: TestCase[], startIndex: number, endIndex: number): TestCase[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

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

  return (
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
                            <Text>Explanation (optional)</Text>
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
      {newProblem.testCases.length ? (
        <Text>No test cases. At least 1 is required in order to be used in a game.</Text>
      ) : null}
      <GreenSmallButtonBlock
        onClick={addTestCase}
      >
        Add
      </GreenSmallButtonBlock>
    </>
  );
}

export default TestCaseEditor;
