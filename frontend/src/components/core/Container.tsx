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
  margin: 15px;
`;

export const FlexInfoBar = styled.div`
  padding: 0.5rem;
  height: 15px;
  line-height: 15px;
  text-align: center;
`;

export const Panel = styled.div`
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  border-color: #ccc;
`;

export const SplitterContainer = styled.div`
  position: relative;
`;

const StyledMainContainer = styled.div`
  margin: 0 auto;
  padding: 10vw 0;
  width: 80%;
`;

const MainContainer = (props: MyProps) => createContainer(StyledMainContainer, props);

export default MainContainer;
