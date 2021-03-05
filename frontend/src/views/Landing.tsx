import React, { useState, useEffect } from 'react';
import { PrimaryButtonLink, TextLink } from '../components/core/Link';
import { LandingHeaderText } from '../components/core/Text';
import FloatingUserCircle from '../components/special/FloatingUserCircle';

type Coordinate = {
  x: number,
  y: number,
}

function LandingPage() {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  useEffect(() => {
    console.log(mousePosition);
  }, [mousePosition]);

  const mouseMoveHandler = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  return (
    <div>
      <FloatingUserCircle top={mousePosition} />
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
