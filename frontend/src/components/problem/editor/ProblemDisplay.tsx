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
  ProblemTag,
  TestCase,
} from '../../../api/Problem';
import {
  FixedTextArea,
  PureTextInputTitle,
  CheckboxInput,
  TextInput,
} from '../../core/Input';
import { Difficulty } from '../../../api/Difficulty';
import {
  SmallDifficultyButton,
  PrimaryButton,
  RedTextButton,
  GrayTextButton,
  SmallButton,
  GreenSmallButtonBlock,
  InvertedSmallButton,
  TextButton,
  InlineLobbyIcon,
  InlineErrorIcon,
} from '../../core/Button';
import ToggleButton from '../../core/ToggleButton';
import PrimarySelect from '../../core/Select';
import {
  SmallHeaderText,
  LowMarginMediumText,
  Text,
  LabelAbsoluteText,
} from '../../core/Text';
import Loading from '../../core/Loading';
import ErrorMessage from '../../core/Error';
import { FlexBareContainer, SettingsContainer } from '../../core/Container';
import { generateRandomId, validIdentifier } from '../../../util/Utility';
import { HoverTooltip } from '../../core/HoverTooltip';
import ProblemTags from '../ProblemTags';
import { useAppSelector, useMousePosition, useProblemEditable } from '../../../util/Hook';
import { ProblemHelpModal } from '../../core/HelpModal';
import OptionsPanel from './OptionsPanel';

const defaultDescription: string = [
  'Replace this line with a short description.',
  '### Parameters',
  '1. `name`: Replace this with a description of the parameter.',
  '### Example Test Case',
  '**Input**',
  '`name`: `value`',
  '**Output**',
  '`value`',
  '**Explanation**',
  'Replace this line with an explanation of this example test case.',
].join('\n\n');

const MainContent = styled.div`
  text-align: left;
  padding: 20px;
  flex: 6;
`;

const TopButtonsContainer = styled.div`
  margin-left: auto;
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
  margin-top: 0;
`;

const TextButtonLink = styled(TextButton)`
  color: ${({ theme }) => theme.colors.gray};
  padding: 0;
  margin-top: 30px;
  text-decoration: underline;
  text-align: left;
`;

const InlineProblemIcon = styled(InlineLobbyIcon)`
  margin: 10px;
  height: 1rem;
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
  const { firebaseUser } = useAppSelector((state) => state.account);
  const problemEditable = useProblemEditable(firebaseUser, problem);

  const [newProblem, setNewProblem] = useState<Problem>(problem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [helpModal, setHelpModal] = useState<boolean>(false);

  // Variable used to force refresh the editor.
  const [refreshEditor, setRefreshEditor] = useState<number>(0);

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

  // Handle updating of normal text fields
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewProblem({
      ...newProblem,
      [name]: value,
    });
  };

  // Handle description change
  const handleDescriptionChange = (value: string) => handleChange({ target: { name: 'description', value } });

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
      <ProblemHelpModal
        show={helpModal}
        exitModal={() => setHelpModal(false)}
      />
      <MainContent>
        <FlexBareContainer>
          <SmallHeaderText>Problem</SmallHeaderText>
          <InlineProblemIcon
            onClick={() => setHelpModal(true)}
          >
            help_outline
          </InlineProblemIcon>
          <TopButtonsContainer>
            <InvertedSmallButton
              onClick={() => {
                onClick(newProblem);
                history.goBack();
              }}
            >
              Back
            </InvertedSmallButton>
            {problemEditable ? (
              <SmallButton
                onClick={() => onClick(newProblem)}
              >
                {actionText}
              </SmallButton>
            ) : null}
          </TopButtonsContainer>
        </FlexBareContainer>
        <SettingsContainerHighPadding>
          <PureTextInputTitle
            placeholder="Write a nice title"
            name="name"
            value={newProblem.name}
            onChange={handleChange}
            readOnly={!problemEditable}
          />
          <TitleDescriptionSeparator />
          <StyledMarkdownEditor
            key={refreshEditor}
            placeholder="Write a nice description"
            defaultValue={newProblem.description}
            onChange={(getNewValue) => handleDescriptionChange(getNewValue())}
            readOnly={!problemEditable}
          />
          {
            (newProblem.description.length === 0 || newProblem.description === '\\\n') ? (
              <TextButtonLink
                onClick={() => {
                  // Add default description and force refresh editor.
                  handleDescriptionChange(defaultDescription);
                  setRefreshEditor(refreshEditor + 1);
                }}
              >
                Not sure what to write? Add a template description.
              </TextButtonLink>
            ) : null
          }
        </SettingsContainerHighPadding>

        {editMode && problemEditable
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
          ) : null}

        {loading ? <Loading /> : null}
        {error ? <ErrorMessage message={error} /> : null}
      </MainContent>
      <OptionsPanel
        newProblem={newProblem}
        setNewProblem={setNewProblem}
        editMode={editMode}
        setLoading={setLoading}
        setError={setError}
      />
    </>
  );
}

export default ProblemDisplay;
