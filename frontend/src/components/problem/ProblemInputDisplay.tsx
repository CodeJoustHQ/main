import React from 'react';
import styled from 'styled-components';
import { ProblemInput, ProblemIOType, problemIOTypeToString } from '../../api/Problem';
import { validIdentifier } from '../../util/Utility';
import { InlineErrorIcon, TextButton } from '../core/Button';
import { TextInput } from '../core/Input';
import PrimarySelect from '../core/Select';

const InputTypeContainer = styled.div`
  margin-bottom: 5px;
`;

const CancelTextButton = styled(TextButton)`
  margin-left: 2.5px;
  color: ${({ theme }) => theme.colors.gray};
`;

type ProblemInputDisplayProps = {
  input: ProblemInput,
  index: number,
  handleInputChange: (index: number, newInput: string, inputType: ProblemIOType) => void,
  problemEditable: boolean,
  setHoverVisible: (hoverVisible: boolean) => void,
  mouseMoveHandler: (e: any) => void,
  deleteProblemInput: (index: number) => void,
};

function ProblemInputDisplay(props: ProblemInputDisplayProps) {
  const {
    input, index, handleInputChange, problemEditable,
    setHoverVisible, mouseMoveHandler, deleteProblemInput,
  } = props;

  return (
    <InputTypeContainer>
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
  );
}

export default ProblemInputDisplay;
