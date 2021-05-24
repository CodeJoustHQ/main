import React from 'react';
import styled from 'styled-components';
import { MinimalHeader } from '../navigation/Header';
import { FullWidthContainer } from '../core/Container';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function FullWidthLayout({ children }: MyProps) {
  return (
    <Content>
      <MinimalHeader />
      <FullWidthContainer>
        {children}
      </FullWidthContainer>
    </Content>
  );
}

export default FullWidthLayout;
