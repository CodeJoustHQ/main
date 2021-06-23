import React, { useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { DefaultButton, InheritedTextButton } from '../core/Button';
import { ContactHeaderText } from '../core/Text';

type CopyIndicator = {
  copied: boolean,
};

export const CopyIndicatorContainer = styled.div.attrs((props: CopyIndicator) => ({
  style: {
    transform: (!props.copied) ? 'translateY(-60px)' : null,
  },
}))<CopyIndicator>`
  position: fixed;
  top: 20px;
  left: 50%;
  transition: transform 0.25s;
  line-height: 0;
  z-index: 5;
`;

export const BottomCopyIndicatorContainer = styled.div.attrs((props: CopyIndicator) => ({
  style: {
    transform: (!props.copied) ? 'translateY(60px)' : null,
    visibility: (props.copied) ? 'visible' : 'hidden',
  },
}))<CopyIndicator>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transition: transform 0.25s;
  line-height: 0;
`;

export const CopyIndicator = styled(DefaultButton)`
  position: relative;
  left: -50%;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  line-height: normal;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.gradients.green};
`;

export const InlineBackgroundCopyText = styled(ContactHeaderText)`
  display: inline-block;
  margin: 0;
  padding: 0.25rem 0.5rem;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const InlineCopyIconWrapper = styled.i`
  margin-left: 5px;
  font-size: inherit;
`;

export const InlineCopyIcon = () => (
  <InlineCopyIconWrapper className="material-icons">
    content_copy
  </InlineCopyIconWrapper>
);

type CopyableProps = {
  text: string,
};

export function Copyable(props: CopyableProps) {
  const { text } = props;

  const [copied, setCopied] = useState(false);

  return (
    <>
      <CopyIndicatorContainer copied={copied}>
        <CopyIndicator onClick={() => setCopied(false)}>
          Link copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>

      <InheritedTextButton onClick={() => {
        copy(text);
        setCopied(true);
      }}
      >
        {text}
        <InlineCopyIcon />
      </InheritedTextButton>
    </>
  );
}
