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
  flex: auto;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const FlexInfoBar = styled.div`
  padding: 0.5rem;
  height: 15px;
  line-height: 15px;
  text-align: center;
`;

export const SplitterContainer = styled.div`
  flex: auto;
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 10px;
`;

const StyledMainContainer = styled.div`
  margin: 0 auto;
  padding: 10vw 0;
  width: 80%;
`;

const MainContainer = (props: MyProps) => createContainer(StyledMainContainer, props);

export default MainContainer;
