import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { LowMarginMediumText, SmallHeaderText, Text } from '../../core/Text';
import ToggleButton from '../../core/ToggleButton';
import { Difficulty } from '../../../api/Difficulty';
import {
  GrayTextButton, InlineErrorIcon, PrimaryButton, SmallDifficultyButton, TextButton,
} from '../../core/Button';
import { generateRandomId, validIdentifier } from '../../../util/Utility';
import ProblemTags from '../ProblemTags';
import { TextInput } from '../../core/Input';
import PrimarySelect from '../../core/Select';
import {
  deleteProblem, ProblemIOType, problemIOTypeToString, ProblemTag, Problem,
} from '../../../api/Problem';
import { SettingsContainer } from '../../core/Container';
import { HoverTooltip } from '../../core/HoverTooltip';
import { useAppSelector, useMousePosition, useProblemEditable } from '../../../util/Hook';

const SidebarContent = styled.div`
  text-align: left;
  padding: 20px;
  flex: 4;
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

type OptionsPanelProps = {
  newProblem: Problem,
  setNewProblem: (problem: Problem) => void,
  editMode: boolean,
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
};

function OptionsPanel(props: OptionsPanelProps) {
  const {
    newProblem, setNewProblem, editMode, setLoading, setError,
  } = props;

  const history = useHistory();
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);

  const { firebaseUser, token } = useAppSelector((state) => state.account);
  const mousePosition = useMousePosition();
  const problemEditable = useProblemEditable(firebaseUser, newProblem);

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

  return (
    <SidebarContent>
      <HoverTooltip
        visible={hoverVisible}
        x={mousePosition.x}
        y={mousePosition.y}
      >
        This variable name is likely invalid
      </HoverTooltip>

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
              // onMouseMove={mouseMoveHandler}
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
  );
}

export default OptionsPanel;
