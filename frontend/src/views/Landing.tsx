import React, { useCallback, useEffect, useState } from 'react';
import { ThemeConfig } from '../components/config/Theme';
import { LandingPageContainer } from '../components/core/Container';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { FloatingCircle, Coordinate } from '../components/special/FloatingCircle';

function LandingPage() {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });
  const movementReduction: number = 40;

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  return (
    <LandingPageContainer>
      <FloatingCircle
        color={ThemeConfig.colors.redCircle}
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
        bottom={50}
        left={-30}
        size={4}
      />
      <FloatingCircle
        color={ThemeConfig.colors.greenCircle}
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
        bottom={-30}
        left={-20}
        size={8}
      />
      <FloatingCircle
        color={ThemeConfig.colors.yellowCircle}
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
        bottom={-20}
        left={47.5}
        size={2}
      />
      <FloatingCircle
        color={ThemeConfig.colors.pinkCircle}
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
        bottom={-25}
        left={95}
        size={7}
      />
      <FloatingCircle
        color={ThemeConfig.colors.blueCircle}
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
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
