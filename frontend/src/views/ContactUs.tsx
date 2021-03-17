import React from 'react';
import styled from 'styled-components';
import { LandingPageContainer } from '../components/core/Container';
import { InlineExternalLink } from '../components/core/Link';
import { ContactHeaderTitle, ContactHeaderText } from '../components/core/Text';

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
        <InlineEmailCopyText
          onClick={() => navigator.clipboard.writeText('support@codejoust.co')}
        >
          support@codejoust.co
          <CopyIcon className="material-icons">content_copy</CopyIcon>
        </InlineEmailCopyText>
        . Say hello!
      </ContactHeaderText>
    </LandingPageContainer>
  );
}

export default ContactUsPage;
