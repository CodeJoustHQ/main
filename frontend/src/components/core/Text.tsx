import styled from 'styled-components';

export const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
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
  display: inline-block;
  margin: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  border-radius: 5px;

  &:hover {
    text-decoration: line-through;
    cursor: pointer;
  }
`;

export const InactiveUserNicknameText = styled(Text)`
  display: inline-block;
  margin: 5px;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.lightRed};
  border-radius: 3px;

  &:hover {
    text-decoration: line-through;
    cursor: pointer;
  }
`;

export const ProblemHeaderText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.default};
`;
