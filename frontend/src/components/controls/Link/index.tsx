import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton } from '../Button';

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

export const PrimaryButtonLink = (props:any) => createButtonLink(PrimaryButton, props);

export const NavbarLink = styled(Link)`
  color: #333;
  font-size: 1.2rem;
  text-decoration: none;
`;

export const TextLink = styled(Link)`
  font-size: 1rem;
  color: gray;
  text-decoration: none;
`;
