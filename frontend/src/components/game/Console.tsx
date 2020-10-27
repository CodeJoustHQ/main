import React, { useState } from 'react';
import styled from 'styled-components';

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the width of Monaco editor upon change in container size
function Console() {
  const [testCases, setTestCases] = useState('');

  return (
    <Content>
      temp
    </Content>
  );
}

export default Console;
