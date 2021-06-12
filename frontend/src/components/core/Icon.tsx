import styled from 'styled-components';

export const InlineIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  display: inline-block;
  margin: 0 0 0 10px;
  padding: 0.25rem;
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  color: ${({ theme }) => theme.colors.font};

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
`;

type ShowError = {
  show: boolean,
};

export const InlineErrorIcon = styled(InlineIcon).attrs((props: ShowError) => ({
  style: {
    display: props.show ? 'inline-block' : 'none',
  },
}))<ShowError>`
  color: ${({ theme }) => theme.colors.gray};
  margin: 0 0.5rem 0 0;
  padding: 0;
  box-shadow: none;

  &:hover {
    cursor: default;
    box-shadow: none;
  }
`;

export const InlineShowIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  display: inline-block;
  position: relative;
  top: 0.1rem;
  margin-left: 0.3rem;
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fontSize.medium};
  color: ${({ theme }) => theme.colors.font};
`;

export const SpectatorBackIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(0%, -50%);
  text-align: center;
  margin: 0;
  border-radius: 2rem;
  font-size: 2rem;
  padding: 1rem;
  width: 2rem;
  height: 2rem;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
`;
