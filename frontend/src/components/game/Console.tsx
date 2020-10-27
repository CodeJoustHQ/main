import React, { useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';

const Content = styled.div`
  height: 100%;
`;

type ConsoleProps = {
  testCases: TestCase[],
};

// This function refreshes the width of Monaco editor upon change in container size
function Console({ testCases }: ConsoleProps) {
  const input = useState(testCases[0].input || '');

  return (
    <Content>
      {input}
    </Content>
  );
}

export default Console;
