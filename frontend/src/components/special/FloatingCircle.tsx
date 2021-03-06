import styled from 'styled-components';

export type Coordinate = {
  x: number,
  y: number,
}

export type CircleParams = {
  color: string,
  x: number,
  y: number,
  bottom: number,
  left: number
  size: number
}

export const FloatingCircle = styled.div<CircleParams>`
  position: absolute;
  bottom: ${({ bottom }) => bottom}%;
  left: ${({ left }) => left}%;
  width: ${({ size }) => size}rem;
  height: ${({ size }) => size}rem;
  background: ${({ color }) => color};
  border-radius: 50%;
  transition: transform 250ms, opacity 400ms;
  transition: left 0.25s ease;
  transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
`;
