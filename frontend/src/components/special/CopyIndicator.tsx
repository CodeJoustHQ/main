import styled from 'styled-components';
import { DefaultButton } from '../core/Button';
import { ContactHeaderText } from '../core/Text';

type CopyIndicator = {
  copied: boolean,
}

export const CopyIndicatorContainer = styled.div.attrs((props: CopyIndicator) => ({
  style: {
    transform: (!props.copied) ? 'translateY(-60px)' : null,
  },
}))<CopyIndicator>`
  position: absolute;
  top: 20px;
  left: 50%;
  transition: transform 0.25s;
`;

export const BottomCopyIndicatorContainer = styled.div.attrs((props: CopyIndicator) => ({
  style: {
    transform: (!props.copied) ? 'translateY(60px)' : null,
  },
}))<CopyIndicator>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transition: transform 0.25s;
`;

export const CopyIndicator = styled(DefaultButton)`
  position: relative;
  left: -50%;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.gradients.green};
`;

export const InlineCopyText = styled(ContactHeaderText)`
  display: inline-block;
  margin: 0;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`;

export const SmallInlineCopyText = styled(InlineCopyText).attrs({ as: 'p' })`
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
`;

export const InlineCopyIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  margin-left: 5px;
`;

export const SmallInlineCopyIcon = styled(InlineCopyIcon)`
  font-size: ${({ theme }) => theme.fontSize.mediumSmall};
`;
