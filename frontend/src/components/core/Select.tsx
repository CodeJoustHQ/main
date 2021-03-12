import styled from 'styled-components';

const PrimarySelect = styled.select`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font};
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  padding: 0.5rem 1rem;
  border: 3px solid ${({ theme }) => theme.colors.blue};
  border-radius: 5px;
`;

export default PrimarySelect;
