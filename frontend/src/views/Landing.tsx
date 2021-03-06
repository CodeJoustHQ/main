import React, { useCallback, useEffect, useState } from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText, LandingHeaderTitle } from '../components/core/Text';
import { FloatingUserCircle, Coordinate } from '../components/special/FloatingUserCircle';

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
    <div>
      <FloatingUserCircle
        x={mousePosition.x / movementReduction}
        y={mousePosition.y / movementReduction}
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
    </div>
  );
}

export default LandingPage;
