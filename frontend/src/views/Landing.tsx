import React, { useCallback, useEffect, useState } from 'react';
import { ThemeConfig } from '../components/config/Theme';
import { LandingPageContainer } from '../components/core/Container';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { FloatingCircle, Coordinate } from '../components/special/FloatingCircle';

function LandingPage() {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  return (
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
      <LandingHeaderTitle>
        CodeJoust
      </LandingHeaderTitle>
      <LandingHeaderText>
        Compete live against friends and classmates to solve coding challenges.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/create">
        Create a room
      </PrimaryButtonLink>
      <br />
      <TextLink to="/game/join">
        Or join an existing room &#8594;
      </TextLink>
    </LandingPageContainer>
  );
}

export default LandingPage;
