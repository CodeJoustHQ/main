import styled from 'styled-components';

type TextAttributes = {
  bold?: boolean,
};

export const Text = styled.p<TextAttributes>`
  font-size: ${({ theme }) => theme.fontSize.default};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`;

export const LabelAbsoluteText = styled.p<TextAttributes>`
  position: absolute;
  top: 1rem;
  right: 5%;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.default};
`;

export const ErrorText = styled(Text)`
   color: ${({ theme }) => theme.colors.red};
`;

export const SmallText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
  margin: 3px 0;
`;

export const SmallHeaderText = styled.p`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  margin: 10px 0;
`;

export const NoMarginSubtitleText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  margin: 0;
`;

export const MediumText = styled.h5`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
`;

export const LowMarginMediumText = styled(MediumText)`
  margin: 1rem 0;
`;

export const NoMarginMediumText = styled(MediumText)`
  margin: 0;
`;

export const LargeText = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xLarge};
`;

export const LandingHeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxLarge};
  color: ${({ theme }) => theme.colors.darkText};
  font-weight: 700;
`;

export const MainHeaderText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  font-weight: 400;
`;

export const SecondaryHeaderText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-weight: 400;
`;

export const ContactHeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xLarge};
  color: ${({ theme }) => theme.colors.darkText};
  font-weight: 700;
`;

export const ContactHeaderText = styled.h1`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.xMediumLarge};
  font-weight: 400;
`;

type NicknameType = {
  me: boolean,
};

export const UserNicknameText = styled(Text)<NicknameType>`
  font-size: ${({ theme }) => theme.fontSize.large};
  font-weight: ${({ me }) => (me ? 700 : 400)};
  margin: 0;
`;

export const ProblemHeaderText = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.large};
  color: ${({ theme }) => theme.colors.darkText};
`;

export const SmallActionHeaderText = styled.p`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSize.medium};
  margin: 0;
`;

export const SmallActionText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.medium};
  margin: 2px 0px;

  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

export const LowMarginText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin: 4px 0;
`;

export const WhiteText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
`;

export const BottomFooterText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
`;
