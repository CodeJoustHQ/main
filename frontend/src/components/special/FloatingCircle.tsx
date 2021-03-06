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

export type CircleHeaderParams = {
  color: string,
  size: number
}

const movementReduction: number = 40;

export const FloatingCircle = styled.div.attrs((props: CircleParams) => ({
  style: {
    background: props.color,
    bottom: `${props.bottom}%`,
    left: `${props.left}%`,
    width: `${props.size}rem`,
    height: `${props.size}rem`,
    transform: `translate(${props.x / movementReduction}px, ${props.y / movementReduction}px)`,
  },
}))<CircleParams>`
  position: absolute;
  border-radius: 50%;
  transition: transform 250ms, opacity 400ms;
  transition: left 0.25s ease;
`;

export const FloatingCircleHeader = styled.div.attrs((props: CircleHeaderParams) => ({
  style: {
    background: props.color,
    width: `${props.size}rem`,
    height: `${props.size}rem`,
  },
}))<CircleHeaderParams>`
  display: inline-block;
  margin-right: 7px;
  border-radius: 50%;
`;
