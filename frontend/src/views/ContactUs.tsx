import React from 'react';
import { LandingPageContainer } from '../components/core/Container';
import { InlineExternalLink } from '../components/core/Link';
import { ContactHeaderTitle, ContactHeaderText, InlineHeaderCopyText } from '../components/core/Text';

function ContactUsPage() {
  return (
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
        <InlineHeaderCopyText>
          support@codejoust.co
          <span className="material-icons-outlined">
            content_copy
          </span>
        </InlineHeaderCopyText>
        . Say hello!
      </ContactHeaderText>
    </LandingPageContainer>
  );
}

export default ContactUsPage;
