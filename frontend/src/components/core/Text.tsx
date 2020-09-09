import styled from 'styled-components';

export const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
`;

export const LandingHeaderText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xLarge};
`;

export const ProblemHeaderText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.Medium};
`;
