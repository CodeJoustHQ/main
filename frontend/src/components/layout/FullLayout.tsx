import React from 'react';
import styled from 'styled-components';
import { MinimalHeader } from '../navigation/Header';
import { FullContainer } from '../core/Container';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function FullLayout({ children }: MyProps) {
  return (
    <Content>
      <MinimalHeader />
      <FullContainer>
        {children}
      </FullContainer>
    </Content>
  );
}

export default FullLayout;
