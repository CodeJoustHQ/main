import React from 'react';
import styled from 'styled-components';
import Header from '../navigation/Header';
import { MainContainer } from '../core/Container';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function MainLayout({ children }: MyProps) {
  return (
    <Content>
      <Header />
      <MainContainer>
        {children}
      </MainContainer>
    </Content>
  );
}

export default MainLayout;
