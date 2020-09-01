import styled from 'styled-components';

export const DefaultButton = styled.button`
  border: none;
  border-radius: 0.25rem;
  margin: 1.2rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
  
  &:hover {
    outline: none;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
  }
  
  &:focus {
    outline: none;
  }
`;

export const SmallButton = styled.button`
  border: none;
  border-radius: 0.25rem;
  margin: 0.6rem;
  font-size: ${({ theme }) => theme.fontSize.default};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  
  &:hover {
    outline: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
  }
  
  &:focus {
    outline: none;
  }
`;

export const PrimaryButton = styled(DefaultButton)<any>`
  font-size: ${({ theme }) => theme.fontSize.large};
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '32vw'};
  height: ${({ height }) => height || '8vw'};
  min-width: 280px;
  min-height: 70px;
`;

export const SecondaryButton = styled(SmallButton)<any>`
  font-size: ${({ theme }) => theme.fontSize.medium};
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.gray};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width || '32vw'};
  height: ${({ height }) => height || '8vw'};
  min-width: 210px;
  min-height: 50px;
`;
