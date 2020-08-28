import React from 'react';
import styled from 'styled-components';
import Header from '../../navigation/Header';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  text-align: center;
  font-size: large;
  background-color: #f0f4f8;
`;

type MyProps = {
  children: React.ReactNode,
}

function MainLayout({ children }: MyProps) {
  return (
    <div>
      <Content>
        <Header />
        {children}
      </Content>
    </div>
  );
}

export default MainLayout;
