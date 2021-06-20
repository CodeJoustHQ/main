import React, { useState } from 'react';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import copy from 'copy-to-clipboard';
import { BottomFooterText, ProblemHeaderText } from '../core/Text';
import { getDifficultyDisplayButton, InheritedTextButton } from '../core/Button';
import { BottomCopyIndicatorContainer, CopyIndicator, InlineCopyIcon } from '../special/CopyIndicator';
import { Panel } from '../core/Container';
import { Problem } from '../../api/Problem';

const StyledMarkdownEditor = styled(MarkdownEditor)`
  margin-top: 15px;
  padding: 0;
  
  p {
    font-family: ${({ theme }) => theme.font};
  }

  // The specific list of attributes to have dark text color.
  .ProseMirror > p, blockquote, h1, h2, h3, ul, ol, table {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OverflowPanel = styled(Panel)`
  overflow-y: auto;
  height: 100%;
  padding: 0 25px;
`;

type ProblemPanelProps = {
  problem: Problem | undefined,
};

function ProblemPanel(props: ProblemPanelProps) {
  const { problem } = props;

  const [copiedEmail, setCopiedEmail] = useState(false);

  return (
    <OverflowPanel>
      <ProblemHeaderText>{problem?.name || 'Loading...'}</ProblemHeaderText>
      {problem ? getDifficultyDisplayButton(problem.difficulty) : null}

      <StyledMarkdownEditor
        defaultValue={problem?.description || ''}
        value={problem?.description || ''}
        onChange={() => ''}
        readOnly
      />
      <BottomFooterText>
        {'Notice an issue? Contact us at '}
        <InheritedTextButton
          onClick={() => {
            copy('support@codejoust.co');
            setCopiedEmail(true);
          }}
        >
          support@codejoust.co
          <InlineCopyIcon>content_copy</InlineCopyIcon>
        </InheritedTextButton>
      </BottomFooterText>

      <BottomCopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </BottomCopyIndicatorContainer>
    </OverflowPanel>
  );
}

export default ProblemPanel;
