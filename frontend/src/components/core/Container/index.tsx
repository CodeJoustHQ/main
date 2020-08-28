import React from 'react';
import { StyledMainContainer } from './styles';

type MyProps = {
  children: React.ReactNode,
}

const createContainer = (Container: any, props: MyProps) => {
  const { children } = props;
  return <Container>{children}</Container>;
};

export const MainContainer = (props: MyProps) => createContainer(StyledMainContainer, props);
