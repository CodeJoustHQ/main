import styled from 'styled-components';

const PrimarySelect = styled.select`
  display: inline-block;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font};
  font-size: ${({ theme }) => theme.fontSize.default};
  padding: 0.25rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  border-radius: 5px;
`;

export default PrimarySelect;
