import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThemeConfig } from '../config/Theme';
import { FloatingCircle, Coordinate } from '../special/FloatingCircle';
import Header from '../navigation/Header';
import { MainContainer, LandingPageContainer } from '../core/Container';

const Content = styled.div`
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function CircleBackgroundLayout({ children }: MyProps) {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  return (
    <Content>
      <Header />
      <MainContainer>
        <LandingPageContainer>
          <FloatingCircle
            color={ThemeConfig.colors.gradients.red}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={50}
            left={-30}
            size={4}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.green}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={-30}
            left={-20}
            size={8}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.yellow}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={-20}
            left={47.5}
            size={2}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.pink}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={-25}
            left={95}
            size={7}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.blue}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={100}
            left={90}
            size={4}
          />
          {children}
        </LandingPageContainer>
      </MainContainer>
    </Content>
  );
}

export default CircleBackgroundLayout;
