import React from 'react';
import styled from 'styled-components';

type MyProps = {
  children: React.ReactNode,
}

const createContainer = (Container: any, props: MyProps) => {
  const { children } = props;
  return <Container>{children}</Container>;
};

export const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 100vh;
  overflow: hidden;
`;

export const FlexInfoBar = styled.div`
  flex: 1 0 100%;
  padding: 0.5rem;
  height: 15px;
  line-height: 15px;
  text-align: center;
`;

export const FlexPanel = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #e3e3e3;
`;

const StyledMainContainer = styled.div`
  margin: 0 auto;
  padding: 10vw 0;
  width: 80%;
`;

const MainContainer = (props: MyProps) => createContainer(StyledMainContainer, props);

export default MainContainer;
