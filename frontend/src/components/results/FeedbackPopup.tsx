import React from 'react';
import Subscribe from '../special/Subscribe';
import { SecondaryHeaderText } from '../core/Text';
import { SecondaryHeaderTextLink } from '../core/Link';

function FeedbackPopup() {
  return (
    <div>
      <h1>
        <span role="img" aria-label="wave">Hello! 👋</span>
      </h1>
      <SecondaryHeaderText>
        Makers of CodeJoust here - if you like (or dislike) the platform,
        we would love to hear your feedback! Feel free to
        {' '}
        <SecondaryHeaderTextLink to="/contact-us" target="_blank">contact us</SecondaryHeaderTextLink>
        {' '}
        at any time, even if just to strike up a friendly conversation.
      </SecondaryHeaderText>
      <SecondaryHeaderText>
        If you want to stay in touch about future updates, fill out the
        form below to subscribe to our mailing list!
      </SecondaryHeaderText>
      <Subscribe />
    </div>
  );
}

export default FeedbackPopup;
