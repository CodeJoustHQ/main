import styled from 'styled-components';

type WidthProps = {
  width?: string,
};

export const Row = styled.div`
  display: flex;
`;

export const Column = styled.div<WidthProps>`
  width: ${({ width }) => width || '50%'};
`;
