import styled from 'styled-components';

const PrimarySelect = styled.select`
  padding: 2.5px 10px;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  border-radius: 5px;
`;

export default PrimarySelect;
