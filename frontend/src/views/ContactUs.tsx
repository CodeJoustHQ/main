import React from 'react';
import { DynamicWidthContainer } from '../components/core/Container';
import { InlineExternalLink } from '../components/core/Link';
import { ContactHeaderTitle, ContactHeaderText } from '../components/core/Text';
import Subscribe from '../components/special/Subscribe';
import { Copyable } from '../components/special/CopyIndicator';

function ContactUsPage() {
  return (
    <>
      <DynamicWidthContainer>
        <ContactHeaderTitle>
          Contact Us
        </ContactHeaderTitle>
        <ContactHeaderText>
          We are a group of students building the tool
          we wish we had when learning computer science.
        </ContactHeaderText>
        <ContactHeaderText>
          You can follow our progress on our
          {' '}
          <InlineExternalLink href="https://github.com/CodeJoustHQ" target="_blank">GitHub</InlineExternalLink>
          {' '}
          or our
          {' '}
          <InlineExternalLink href="https://trello.com/b/jb0SgY1b/engineering-sprint-board" target="_blank">public roadmap on Trello</InlineExternalLink>
          .
        </ContactHeaderText>
        <ContactHeaderText>
          You can contact us at
          {' '}
          <Copyable text="support@codejoust.co" top />
          . Say hello!
        </ContactHeaderText>
        <br />
        <ContactHeaderText>
          If you would like to keep up with future updates, fill out the form below:
        </ContactHeaderText>
        <Subscribe />
      </DynamicWidthContainer>
    </>
  );
}

export default ContactUsPage;
