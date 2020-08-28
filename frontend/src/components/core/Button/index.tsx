import styled from 'styled-components';

const DefaultButton = styled.button`
  border: none;
  margin: 1.2rem;
  font-size: 1rem;
  
  &:hover {
    outline: none;
    cursor: pointer;
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
