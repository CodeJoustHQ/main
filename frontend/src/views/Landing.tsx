import React, { useCallback, useEffect, useState } from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';
import { FloatingUserCircle, Coordinate } from '../components/special/FloatingUserCircle';

function LandingPage() {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  return (
    <div>
      <FloatingUserCircle
        x={mousePosition.x / 50}
        y={mousePosition.x / 50}
      />
      <LandingHeaderText>
        Practice coding by competing against your friends.
      </LandingHeaderText>
      <PrimaryButtonLink to="/game/join">
        Join a Game
      </PrimaryButtonLink>
      <br />
      <TextLink to="/game/create">
        Or create a room &#8594;
      </TextLink>
    </div>
  );
}

export default LandingPage;
