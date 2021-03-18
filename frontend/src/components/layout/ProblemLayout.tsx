import React from 'react';
import styled from 'styled-components';
import { MinimalHeader } from '../navigation/Header';
import { ProblemContainer } from '../core/Container';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function ProblemLayout({ children }: MyProps) {
  return (
    <Content>
      <MinimalHeader />
      <ProblemContainer>
        {children}
      </ProblemContainer>
    </Content>
  );
}

export default ProblemLayout;
