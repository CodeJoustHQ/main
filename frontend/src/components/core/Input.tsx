import styled from 'styled-components';

const InputBlock = styled.input`
  border-radius: 0.25rem;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  border: 3px solid ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  padding: 1rem;
  margin: 1rem auto;
  outline: none;

  &:focus {
    border: 3px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export default InputBlock;
