import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton } from './Button';

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

// Wrap a button inside of a Link that triggers an onClick function
const createButtonOnClick = (Button:any, props:any) => {
  const { onClickFunc, children, ...rest } = props;
  const button = (
    <Button onClick={onClickFunc} {...rest}>
      {children}
    </Button>
  );

  return button;
};

export const PrimaryButtonLink = (props:any) => createButtonLink(PrimaryButton, props);

export const SocketButtonConnection = (props:any) => createButtonOnClick(PrimaryButton, props);

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
