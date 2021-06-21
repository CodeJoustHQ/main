import React, { useState } from 'react';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import copy from 'copy-to-clipboard';
import { BottomFooterText, ProblemHeaderText } from '../core/Text';
import { DefaultButton, getDifficultyDisplayButton, InheritedTextButton } from '../core/Button';
import { BottomCopyIndicatorContainer, CopyIndicator, InlineCopyIcon } from '../special/CopyIndicator';
import {
  FlexHorizontalContainer, FlexLeft, FlexRight, Panel,
} from '../core/Container';
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

const ProblemNavContainer = styled(FlexRight)`
  align-items: baseline;
  padding: 15px 0;
`;

const ProblemNavButton = styled(DefaultButton)`
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  width: 40px;
  height: 40px;
  margin: 5px;
`;

type ProblemPanelProps = {
  problem: Problem | undefined,
  onNext: (() => void) | null,
  onPrev: (() => void) | null,
};

function ProblemPanel(props: ProblemPanelProps) {
  const { problem, onNext, onPrev } = props;

  const [copiedEmail, setCopiedEmail] = useState(false);

  return (
    <OverflowPanel>
      <FlexHorizontalContainer>
        <FlexLeft>
          <div>
            <ProblemHeaderText>{problem?.name || 'Loading...'}</ProblemHeaderText>
            {problem ? getDifficultyDisplayButton(problem.difficulty) : null}
          </div>
        </FlexLeft>
        <ProblemNavContainer>
          <ProblemNavButton onClick={onPrev || undefined}>&#60;</ProblemNavButton>
          <ProblemNavButton onClick={onNext || undefined}>&#62;</ProblemNavButton>
        </ProblemNavContainer>
      </FlexHorizontalContainer>

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
