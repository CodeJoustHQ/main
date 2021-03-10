import styled from 'styled-components';

type TextAttributes = {
  bold?: boolean,
};

export const Text = styled.p<TextAttributes>`
  font-size: ${({ theme }) => theme.fontSize.default};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`;

export const ErrorText = styled(Text)`
   color: ${({ theme }) => theme.colors.red};
`;

export const SmallText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
  margin: 6px 0;
`;

export const MediumText = styled.h5`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
`;

export const LargeText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xLarge};
`;

export const LandingHeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxLarge};
  font-weight: 700;
`;

export const LandingHeaderText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  font-weight: 400;
`;

export const UserNicknameText = styled(LargeText)`
  margin: 0;
`;

export const ProblemHeaderText = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
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

export const LowMarginText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin: 10px 0;
`;
