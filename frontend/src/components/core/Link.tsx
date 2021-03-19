import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton, InvertedSmallButton } from './Button';

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

export const PrimaryButtonLink = (props:any) => createButtonLink(PrimaryButton, props);

export const InvertedSmallButtonLink = (props: any) => createButtonLink(
  InvertedSmallButton,
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

export const GrayExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.gray};
  text-decoration: underline;
`;
