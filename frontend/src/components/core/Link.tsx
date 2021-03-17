import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton, GraySmallButton } from './Button';

const AutoLeftMarginLink = styled(Link)`
  margin-left: auto;
`;

// Wrap a button inside of a Link to get the styling of a button
const createButtonLink = (Button:any, props:any) => {
  const {
    to,
    children,
    ...rest
  } = props;
  const button = (
    <Button {...rest}>
      {children}
    </Button>
  );

  return <Link to={to}>{button}</Link>;
};

// Wrap a button inside of a link with an auto margin-left
const createButtonLinkAutoLeftMargin = (Button:any, props:any) => {
  const {
    to,
    children,
    ...rest
  } = props;
  const button = (
    <Button {...rest}>
      {children}
    </Button>
  );

  return <AutoLeftMarginLink to={to}>{button}</AutoLeftMarginLink>;
};

export const PrimaryButtonLink = (props:any) => createButtonLink(PrimaryButton, props);

export const GraySmallButtonLinkAutoLeftMargin = (props: any) => createButtonLinkAutoLeftMargin(
  GraySmallButton,
  props,
);

export const NavbarLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  text-decoration: none;
`;

export const TextLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.colors.gray};
  text-decoration: none;
`;
