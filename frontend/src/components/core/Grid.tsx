import styled from 'styled-components';

type HeightProps = {
  height?: string,
};

type WidthProps = {
  width?: string,
};

export const Row = styled.div<HeightProps>`
  display: flex;
  ${({ height }) => height && `height: ${height}`};
`;

export const Column = styled.div<WidthProps>`
  width: ${({ width }) => width || '50%'};
`;
