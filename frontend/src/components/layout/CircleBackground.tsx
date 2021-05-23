import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThemeConfig } from '../config/Theme';
import { FloatingCircle, Coordinate } from '../special/FloatingCircle';
import { MainContainer, DynamicWidthContainer } from '../core/Container';
import { Header } from '../navigation/Header';
import { useAppSelector } from '../../util/Hook';
import MinimalLayout from './MinimalLayout';

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 750px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MyProps = {
  children: React.ReactNode,
}

function CircleBackgroundLayout({ children }: MyProps) {
  const { firebaseUser } = useAppSelector((state) => state.account);
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  // If logged in, the home page becomes the dashboard, which uses a minimal layout
  if (firebaseUser) {
    return <MinimalLayout>{children}</MinimalLayout>;
  }

  return (
    <Content>
      <Header />
      <MainContainer>
        <DynamicWidthContainer>
          {children}
        </DynamicWidthContainer>
        <div>
          <FloatingCircle
            color={ThemeConfig.colors.gradients.red}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={60}
            left={7}
            size={4}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.green}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={35}
            left={13}
            size={8}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.yellow}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={32}
            left={48}
            size={2}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.pink}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={35}
            left={74}
            size={7}
          />
          <FloatingCircle
            color={ThemeConfig.colors.gradients.blue}
            x={mousePosition.x}
            y={mousePosition.y}
            bottom={76}
            left={71}
            size={4}
          />
        </div>
      </MainContainer>
    </Content>
  );
}

export default CircleBackgroundLayout;
