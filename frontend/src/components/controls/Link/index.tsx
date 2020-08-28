import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledPrimaryButton } from './styles';

// Wrap a button inside of a Link to get the styling of a button
const createButtonLink = (Button:any, props:any) => {
  const { to, children, ...rest } = props;
  const button = (
    <Button {...rest}>
      {children}
    </Button>
  );

  return <Link to={to}>{button}</Link>;
};

export const PrimaryLink = (props:any) => createButtonLink(StyledPrimaryButton, props);

export const TextLink = styled(Link)`
  font-size: medium;
  color: gray;
  text-decoration: none;
`;
