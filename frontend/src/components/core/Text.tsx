import styled from 'styled-components';

export const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
`;

export const BoldText = styled(Text)`
  font-weight: bold;
`;

export const ErrorText = styled(Text)`
   color: ${({ theme }) => theme.colors.red};
`;

export const MediumText = styled.h5`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
`;

export const LargeText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xLarge};
`;

export const LandingHeaderText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxLarge};
`;

export const UserNicknameText = styled(LargeText)`
  margin: 0;
`;

export const ProblemHeaderText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.default};
`;

export const SmallActionText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
  display: inline;
  margin: 1px 4px;
  padding: 2px 4px;

  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;
