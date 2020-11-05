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
  margin: 1rem;
`;

export const FlexInfoBar = styled.div`
  padding: 0.5rem;
  height: 1rem;
  text-align: center;
`;

export const Panel = styled.div`
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background-color: white;
`;

export const SplitterContainer = styled.div`
  flex: auto;
  position: relative;
`;

const StyledMainContainer = styled.div`
  margin: 0 auto;
  padding: 10vw 0;
  width: 80%;
`;

export const MainContainer = (props: MyProps) => createContainer(StyledMainContainer, props);
