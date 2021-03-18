import React, { useState } from 'react';
import styled from 'styled-components';
import { DefaultButton } from '../components/core/Button';
import { LandingPageContainer } from '../components/core/Container';
import { InlineExternalLink } from '../components/core/Link';
import { ContactHeaderTitle, ContactHeaderText } from '../components/core/Text';

type CopyIndicator = {
  copiedEmail: boolean,
}

const CopyIndicatorContainer = styled.div.attrs((props: CopyIndicator) => ({
  style: {
    transform: (!props.copiedEmail) ? 'translateY(-60px)' : null,
  },
}))<CopyIndicator>`
  position: absolute;
  top: 20px;
  left: 50%;
  transition: transform 0.25s;
`;

const CopyIndicator = styled(DefaultButton)`
  position: relative;
  left: -50%;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.gradients.green};
`;

function ContactUsPage() {
  const InlineEmailCopyText = styled(ContactHeaderText)`
    display: inline-block;
    margin: 0;
    cursor: pointer;
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  `;

  const CopyIcon = styled.i`
    margin-left: 5px;
  `;

  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  return (
    <>
      <CopyIndicatorContainer copiedEmail={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied to clipboard!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>
      <LandingPageContainer>
        <ContactHeaderTitle>
          Contact Us
        </ContactHeaderTitle>
        <ContactHeaderText>
          We are two students building the tool we wish we had when learning computer science.
        </ContactHeaderText>
        <ContactHeaderText>
          You can follow our progress on our
          {' '}
          <InlineExternalLink href="https://github.com/rocketden" target="_blank">GitHub</InlineExternalLink>
          {' '}
          or our
          {' '}
          <InlineExternalLink href="https://trello.com/b/jb0SgY1b/sprint-board" target="_blank">public roadmap on Trello</InlineExternalLink>
          .
        </ContactHeaderText>
        <ContactHeaderText>
          You can contact us at
          {' '}
          <InlineEmailCopyText
            onClick={() => {
              navigator.clipboard.writeText('support@codejoust.co');
              setCopiedEmail(true);
            }}
          >
            support@codejoust.co
            <CopyIcon className="material-icons">content_copy</CopyIcon>
          </InlineEmailCopyText>
          . Say hello!
        </ContactHeaderText>
      </LandingPageContainer>
    </>
  );
}

export default ContactUsPage;
