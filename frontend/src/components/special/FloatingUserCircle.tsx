import styled from 'styled-components';

export type Coordinate = {
  x: number,
  y: number,
}

export const FloatingUserCircle = styled.div<Coordinate>`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  background: linear-gradient(207.68deg, #14D633 10.68%, #DAFFB5 91.96%);
  border-radius: 50%;
  transition: left 0.25s ease;
  transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
`;
