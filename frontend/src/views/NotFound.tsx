import React from 'react';
import { TextLink } from '../components/core/Link';
import { MainHeaderText } from '../components/core/Text';

function NotFound() {
  return (
    <div>
      <MainHeaderText>
        Uh oh! Page not found
      </MainHeaderText>
      <TextLink to="/">
        Click here to return to home &#8594;
      </TextLink>
    </div>
  );
}

export default NotFound;
