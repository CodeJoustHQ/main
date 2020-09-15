import React from 'react';
import styled from 'styled-components';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function GameLayout({ children }: MyProps) {
  return (
    <Content>
      {children}
    </Content>
  );
}

export default GameLayout;
