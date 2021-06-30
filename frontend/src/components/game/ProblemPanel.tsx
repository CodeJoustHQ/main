import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from 'rich-markdown-editor';
import { BottomFooterText, ProblemHeaderText, SmallText } from '../core/Text';
import { DefaultButton, getDifficultyDisplayButton } from '../core/Button';
import { Copyable } from '../special/CopyIndicator';
import {
  CenteredContainer, FlexLeft, FlexRight, Panel,
} from '../core/Container';
import { Problem } from '../../api/Problem';
import { NextIcon, PrevIcon } from '../core/Icon';

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

const HeaderContainer = styled.div`
  display: flex;
  flex: auto;
  justify-content: space-between;
`;

const TitleContainer = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;

const ProblemNavContainer = styled.div`
  width: 100px;
  min-width: 100px;
  align-items: baseline;
  padding: 15px 0;
`;

const ProblemCountText = styled(SmallText)`
  color: gray;
`;

type ProblemNavButtonProps = {
  disabled: boolean,
};

const ProblemNavButton = styled(DefaultButton)<ProblemNavButtonProps>`
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.lightgray : theme.colors.gray)};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  width: 35px;
  height: 35px;
  margin: 5px;
  
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
  
  &:hover {
    box-shadow: ${({ disabled }) => (disabled ? '0 1px 6px rgba(0, 0, 0, 0.16)' : '0 1px 6px rgba(0, 0, 0, 0.20)')};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')}; 
  }
  
  i {
    line-height: 35px;
  }
`;

type ProblemPanelProps = {
  problems: Problem[],
  index: number,
  onNext: (() => void) | null,
  onPrev: (() => void) | null,
};

function ProblemPanel(props: ProblemPanelProps) {
  const {
    problems, index, onNext, onPrev,
  } = props;

  return (
    <OverflowPanel>
      <HeaderContainer>
        <div>
          <TitleContainer>
            <ProblemHeaderText>{problems[index]?.name || 'Loading...'}</ProblemHeaderText>
          </TitleContainer>
          {problems[index] ? getDifficultyDisplayButton(problems[index].difficulty) : null}
        </div>
        <ProblemNavContainer>
          <CenteredContainer>
            <div>
              <ProblemNavButton onClick={onPrev || undefined} disabled={!onPrev}>
                <PrevIcon />
              </ProblemNavButton>
              <ProblemNavButton onClick={onNext || undefined} disabled={!onNext}>
                <NextIcon />
              </ProblemNavButton>
            </div>
            <ProblemCountText>
              {`Problem ${index + 1} of ${problems.length}`}
            </ProblemCountText>
          </CenteredContainer>
        </ProblemNavContainer>
      </HeaderContainer>

      <StyledMarkdownEditor
        defaultValue={problems[index]?.description || ''}
        value={problems[index]?.description || ''}
        onChange={() => ''}
        readOnly
      />
      <BottomFooterText>
        Notice an issue? Contact us at
        {' '}
        <Copyable text="support@codejoust.co" top={false} />
      </BottomFooterText>
    </OverflowPanel>
  );
}

export default ProblemPanel;
