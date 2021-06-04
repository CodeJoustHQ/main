import React, { useCallback, useState } from 'react';
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
} from '../../api/Problem';
import {
  FixedTextArea,
  PureTextInputTitle,
  CheckboxInput,
  TextInput,
} from '../core/Input';
import { Difficulty } from '../../api/Difficulty';
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
} from '../core/Button';
import ToggleButton from '../core/ToggleButton';
import PrimarySelect from '../core/Select';
import {
  SmallHeaderText,
  LowMarginMediumText,
  Text,
  LabelAbsoluteText,
} from '../core/Text';
import Loading from '../core/Loading';
import ErrorMessage from '../core/Error';
import { FlexBareContainer } from '../core/Container';
import { generateRandomId, validIdentifier } from '../../util/Utility';
import { HoverTooltip } from '../core/HoverTooltip';
import { Coordinate } from '../special/FloatingCircle';
import ProblemTags from './ProblemTags';
import { useAppSelector, useProblemEditable } from '../../util/Hook';
import { ProblemHelpModal } from '../core/HelpModal';

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

type ShowProps = {
  show: boolean,
};

const ApprovalContainer = styled.div<ShowProps>`
  display: ${({ show }) => (show ? 'inline-block' : 'none')};
  text-align: left;
  margin-top: 0.5rem;
`;

const ApprovalText = styled(Text)`
  display: inline-block;
  margin: 0 0 0 0.75rem;
  font-size: ${({ theme }) => theme.fontSize.subtitleXMediumLarge};
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

const DeleteButton = styled(PrimaryButton)`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.red2};
  background: ${({ theme }) => theme.colors.white};
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

const InputTypeContainer = styled.div`
  margin-bottom: 5px;
`;

const CancelTextButton = styled(TextButton)`
  margin-left: 2.5px;
  color: ${({ theme }) => theme.colors.gray};
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
  const { firebaseUser, token } = useAppSelector((state) => state.account);
  const problemEditable = useProblemEditable(firebaseUser, problem);

  const [newProblem, setNewProblem] = useState<Problem>(problem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);
  const [helpModal, setHelpModal] = useState<boolean>(false);

  // Variable used to force refresh the editor.
  const [refreshEditor, setRefreshEditor] = useState<number>(0);

  // Get current mouse position.
  const mouseMoveHandler = useCallback((e: any) => {
    setMousePosition({ x: e.pageX, y: e.pageY });
  }, [setMousePosition]);

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

    deleteProblem(newProblem.problemId, token || '')
      .then(() => {
        setLoading(false);
        history.replace('/');
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

  // Handle approval change
  const handleApprovalChange = (value: boolean) => handleChange({ target: { name: 'approval', value } });

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

  const addTag = (newTag: ProblemTag) => {
    setNewProblem({
      ...newProblem,
      problemTags: [...newProblem.problemTags, newTag],
    });
  };

  const removeTag = (index: number) => {
    setNewProblem({
      ...newProblem,
      problemTags: newProblem.problemTags.filter((_, i) => index !== i),
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
      <ProblemHelpModal
        show={helpModal}
        exitModal={() => setHelpModal(false)}
      />
      <HoverTooltip
        visible={hoverVisible}
        x={mousePosition.x}
        y={mousePosition.y}
      >
        This variable name is likely invalid
      </HoverTooltip>
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
          <ApprovalContainer
            show={editMode}
          >
            <ToggleButton
              onChangeFunction={() => handleApprovalChange(!newProblem.approval)}
              editable={problemEditable}
              checked={newProblem.approval}
            />
            <ApprovalText>
              {newProblem.approval ? 'Approved' : 'Approval Pending'}
            </ApprovalText>
          </ApprovalContainer>
          <LowMarginMediumText>Difficulty</LowMarginMediumText>
          {Object.keys(Difficulty).map((key) => {
            const difficulty = Difficulty[key as keyof typeof Difficulty];
            if (difficulty !== Difficulty.Random) {
              return (
                <SmallDifficultyButton
                  key={generateRandomId()}
                  difficulty={difficulty || Difficulty.Random}
                  onClick={() => (problemEditable ? handleEnumChange('difficulty', difficulty) : '')}
                  active={difficulty === newProblem.difficulty}
                  enabled={problemEditable}
                >
                  {key}
                </SmallDifficultyButton>
              );
            }
            return null;
          })}

          {
            editMode ? (
              <ProblemTags
                problemTags={newProblem.problemTags}
                addTag={addTag}
                removeTag={removeTag}
                viewOnly={!problemEditable}
              />
            ) : null
          }

          <LowMarginMediumText>Parameters</LowMarginMediumText>
          {newProblem.problemInputs.map((input, index) => (
            <InputTypeContainer
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              <TextInput
                value={input.name}
                onChange={(e) => handleInputChange(index,
                  e.target.value, input.type)}
                disabled={!problemEditable}
              />

              <InlineErrorIcon
                show={!validIdentifier(input.name)}
                onMouseEnter={() => setHoverVisible(true)}
                onMouseMove={mouseMoveHandler}
                onMouseLeave={() => setHoverVisible(false)}
              >
                error_outline
              </InlineErrorIcon>

              <PrimarySelect
                onChange={(e) => handleInputChange(
                  index,
                  input.name,
                  ProblemIOType[e.target.value as keyof typeof ProblemIOType],
                )}
                value={problemIOTypeToString(input.type)}
                disabled={!problemEditable}
              >
                {
                  Object.keys(ProblemIOType).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))
                }
              </PrimarySelect>

              {problemEditable ? (
                <CancelTextButton
                  onClick={() => deleteProblemInput(index)}
                >
                  ✕
                </CancelTextButton>
              ) : null}
            </InputTypeContainer>
          ))}

          {problemEditable ? (
            <GrayTextButton onClick={addProblemInput}>
              Add +
            </GrayTextButton>
          ) : null}

          <LowMarginMediumText>Return Type</LowMarginMediumText>
          <PrimarySelect
            onChange={(e) => handleEnumChange('outputType', ProblemIOType[e.target.value as keyof typeof ProblemIOType])}
            value={problemIOTypeToString(newProblem.outputType)}
            disabled={!problemEditable}
          >
            {
              Object.keys(ProblemIOType).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))
            }
          </PrimarySelect>

          {editMode && problemEditable
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
