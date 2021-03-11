import React from 'react';
import styled from 'styled-components';
import { ThemeConfig } from '../config/Theme';
import { NavbarLink } from '../core/Link';
import { FloatingCircleHeader } from '../special/FloatingCircle';

const Content = styled.div`
  height: 50px;
  padding: 20px;
  text-align: center;
`;

const MinimalContent = styled.div`
  height: 20px;
  padding: 20px 20px 0px 20px;
  text-align: center;
`;

const LeftHeader = styled(NavbarLink)`
  float: left;
  margin-left: 50px;
`;

const RightHeader = styled(NavbarLink)`
  float: right;
  margin-right: 50px;
`;

// Note: Can also create a center header with simply display: inline-block

export function Header() {
  return (
    <Content>
      <nav>
        <LeftHeader to="/">
          <FloatingCircleHeader
            color={ThemeConfig.colors.gradients.purple}
            size={0.9}
          />
          CodeJoust
        </LeftHeader>
        <RightHeader to="contact-us">
          Contact Us
        </RightHeader>
      </nav>
    </Content>
  );
}

export function MinimalHeader() {
  return (
    <MinimalContent>
      <nav>
        <LeftHeader to="/">
          <FloatingCircleHeader
            color={ThemeConfig.colors.gradients.purple}
            size={0.9}
          />
          CodeJoust
        </LeftHeader>
        <RightHeader to="contact-us">
          Contact Us
        </RightHeader>
      </nav>
    </MinimalContent>
  );
}
