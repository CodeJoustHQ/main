import React from 'react';
import styled from 'styled-components';
import Header from '../navigation/Header';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function GameLayout({ children }: MyProps) {
  return (
    <Content>
      <Header />
      {children}
    </Content>
  );
}

export default GameLayout;
