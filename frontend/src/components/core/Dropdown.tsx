import React from 'react';
import styled from 'styled-components';

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  
  padding: 8px;
  width: 120px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  
  z-index: 2;
`;

function Dropdown() {
  return (
    <Content>
      hello
    </Content>
  );
}

export default Dropdown;
