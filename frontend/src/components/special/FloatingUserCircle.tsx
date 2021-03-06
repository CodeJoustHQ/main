import styled from 'styled-components';

export type Coordinate = {
  x: number,
  y: number,
}

export const FloatingUserCircle = styled.div<Coordinate>`
  position: absolute;
  bottom: -25%;
  left: -20%;
  width: 8rem;
  height: 8rem;
  background: linear-gradient(207.68deg, #14D633 10.68%, #DAFFB5 91.96%);
  border-radius: 50%;
  transition: transform 250ms, opacity 400ms;
  transition: left 0.25s ease;
  transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
`;
