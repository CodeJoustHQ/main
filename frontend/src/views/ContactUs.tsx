import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { LandingPageContainer } from '../components/core/Container';
import { InlineExternalLink } from '../components/core/Link';
import { ContactHeaderTitle, ContactHeaderText } from '../components/core/Text';
import {
  CopyIndicator,
  CopyIndicatorContainer,
  InlineCopyIcon,
  InlineCopyText,
} from '../components/special/CopyIndicator';

function ContactUsPage() {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  return (
    <>
      <CopyIndicatorContainer copied={copiedEmail}>
        <CopyIndicator onClick={() => setCopiedEmail(false)}>
          Email copied!&nbsp;&nbsp;✕
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
          <InlineCopyText
            onClick={() => {
              copy('support@codejoust.co');
              setCopiedEmail(true);
            }}
          >
            support@codejoust.co
            <InlineCopyIcon>content_copy</InlineCopyIcon>
          </InlineCopyText>
          . Say hello!
        </ContactHeaderText>
      </LandingPageContainer>
    </>
  );
}

export default ContactUsPage;
