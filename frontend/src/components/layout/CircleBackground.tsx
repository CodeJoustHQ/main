import React from 'react';
import styled from 'styled-components';
import { ThemeConfig } from '../config/Theme';
import { FloatingCircle } from '../special/FloatingCircle';
import { MainContainer } from '../core/Container';
import { Header } from '../navigation/Header';
import { useMousePosition } from '../../util/Hook';

const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  overflow-x: hidden;
`;

const InnerContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CircleContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 800px;
`;

type MyProps = {
  children: React.ReactNode,
}

export function FloatingCircles() {
  const mousePosition = useMousePosition();

  return (
    <>
      <FloatingCircle
        color={ThemeConfig.colors.gradients.red}
        x={mousePosition.x}
        y={mousePosition.y}
        bottom={65}
        left={2}
        size={4}
      />
      <FloatingCircle
        color={ThemeConfig.colors.gradients.green}
        x={mousePosition.x}
        y={mousePosition.y}
        bottom={30}
        left={5}
        size={7}
      />
      <FloatingCircle
        color={ThemeConfig.colors.gradients.yellow}
        x={mousePosition.x}
        y={mousePosition.y}
        bottom={87}
        left={36}
        size={3}
      />
      <FloatingCircle
        color={ThemeConfig.colors.gradients.pink}
        x={mousePosition.x}
        y={mousePosition.y}
        bottom={32}
        left={82}
        size={7}
      />
      <FloatingCircle
        color={ThemeConfig.colors.gradients.blue}
        x={mousePosition.x}
        y={mousePosition.y}
        bottom={76}
        left={88}
        size={4}
      />
    </>
  );
}

function CircleBackgroundLayout({ children }: MyProps) {
  return (
    <Content>
      <Header />
      <MainContainer>
        <InnerContent>
          {children}
        </InnerContent>
        <CircleContent>
          <FloatingCircles />
        </CircleContent>
      </MainContainer>
    </Content>
  );
}

export default CircleBackgroundLayout;
