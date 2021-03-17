import React from 'react';
import { Link } from 'react-router-dom';
import { LandingPageContainer } from '../components/core/Container';
import { ContactHeaderTitle, ContactHeaderText } from '../components/core/Text';

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
        <Link to="https://github.com/rocketden" target="_blank">GitHub</Link>
        {' '}
        or our
        {' '}
        <Link to="https://trello.com/b/jb0SgY1b/sprint-board" target="_blank">public roadmap on Trello</Link>
        .
      </ContactHeaderText>
      <ContactHeaderText>
        You can contact us at
        {' '}
        <Link to="mailto::support@codejoust.co" target="_blank">support@codejoust.co</Link>
        . Say hello!
      </ContactHeaderText>
    </LandingPageContainer>
  );
}

export default ContactUsPage;
