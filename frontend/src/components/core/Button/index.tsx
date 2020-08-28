import styled from 'styled-components';

export const DefaultButton = styled.button`
  border: none;
  border-radius: 0.25rem;
  margin: 1.2rem;
  font-size: 1rem;
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

export const PrimaryButton = styled(DefaultButton)<any>`
  background-color: #3399cc;
  color: white;
  width: ${({ width }) => width || '200px'};
  height: ${({ height }) => height || '80px'};
`;
