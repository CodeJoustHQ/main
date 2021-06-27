import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import { Problem } from '../../../api/Problem';
import { PureTextInputTitle } from '../../core/Input';
import {
  SmallButton,
  InvertedSmallButton,
  TextButton,
} from '../../core/Button';
import { SmallHeaderText } from '../../core/Text';
import Loading from '../../core/Loading';
import ErrorMessage from '../../core/Error';
import { FlexBareContainer, SettingsContainer } from '../../core/Container';
import { useAppSelector, useProblemEditable } from '../../../util/Hook';
import { ProblemHelpModal } from '../../core/HelpModal';
import OptionsPanel from './OptionsPanel';
import TestCaseEditor from './TestCaseEditor';
import { InlineIcon } from '../../core/Icon';

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

const SettingsContainerHighPadding = styled(SettingsContainer)`
  padding: 3rem;
`;

const TitleDescriptionSeparator = styled.hr`
  margin: 1rem 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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

const TextButtonLink = styled(TextButton)`
  color: ${({ theme }) => theme.colors.gray};
  padding: 0;
  margin-top: 30px;
  text-decoration: underline;
  text-align: left;
`;

const InlineProblemIcon = styled(InlineIcon)`
  margin: 10px;
  height: 1rem;
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
  const { firebaseUser } = useAppSelector((state) => state.account);
  const problemEditable = useProblemEditable(firebaseUser, problem);

  const [newProblem, setNewProblem] = useState<Problem>(problem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [helpModal, setHelpModal] = useState<boolean>(false);

  // Variable used to force refresh the editor.
  const [refreshEditor, setRefreshEditor] = useState<number>(0);

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
                if (JSON.stringify(problem) === JSON.stringify(newProblem)
                  // eslint-disable-next-line no-alert
                  || window.confirm('Go back? Your unsaved changes will be lost.')) {
                  // Use the return link if available; otherwise, use dashboard.
                  if (history.action !== 'POP') {
                    history.goBack();
                  } else {
                    history.push('/');
                  }
                }
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
            <TestCaseEditor
              newProblem={newProblem}
              setNewProblem={setNewProblem}
            />
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
