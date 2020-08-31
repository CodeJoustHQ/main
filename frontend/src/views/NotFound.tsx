import React from 'react';
import { TextLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';

function NotFound() {
  return (
    <div>
      <LandingHeaderText>
        Uh oh! Page not found
      </LandingHeaderText>
      <TextLink to="/">
        Click here to return to home &#8594;
      </TextLink>
    </div>
  );
}

export default NotFound;
