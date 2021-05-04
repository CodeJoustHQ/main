import React from 'react';
import styled from 'styled-components';
import { NavbarLink } from '../core/Link';
import app from '../../api/Firebase';
import { TextButton } from '../core/Button';

const Content = styled.div`
  height: 50px;
  padding: 20px;
  text-align: center;
`;

const MinimalContent = styled.div`
  height: 20px;
  padding: 20px 20px 0 20px;
  text-align: center;
`;

const LeftHeader = styled(NavbarLink)`
  float: left;
  margin-left: 50px;
`;

const RightHeader = styled(NavbarLink)`
  margin: 0 15px;
`;

const NavButton = styled(TextButton)`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  margin: 0 15px;
`;

const RightContainer = styled.div`
  float: right;
  margin-right: 50px;
`;

const InlineHeaderTag = styled.span`
  position: relative;
  top: -0.1rem;
  margin-left: 0.4rem;
  padding: 0 0.5rem;
  font-size: ${({ theme }) => theme.fontSize.medium};
  background: ${({ theme }) => theme.colors.gradients.purple};
  border-radius: 1rem;
  color: ${({ theme }) => theme.colors.white};
`;

const LogoIcon = styled.img`
  vertical-align: bottom;
  width: 27px;
  margin-right: 5px;
`;

// Note: Can also create a center header with simply display: inline-block

function HeaderContent() {
  return (
    <nav>
      <LeftHeader to="/">
        <LogoIcon src="/logo512.png" alt="Logo Icon" />
        CodeJoust
        <InlineHeaderTag>Beta</InlineHeaderTag>
      </LeftHeader>
      <RightContainer>
        <RightHeader to="/contact-us">
          Contact Us
        </RightHeader>
        <NavButton onClick={() => app.auth().signOut()}>
          Log Out
        </NavButton>
      </RightContainer>
    </nav>
  );
}

export function Header() {
  return (
    <Content>
      <HeaderContent />
    </Content>
  );
}

export function MinimalHeader() {
  return (
    <MinimalContent>
      <HeaderContent />
    </MinimalContent>
  );
}
