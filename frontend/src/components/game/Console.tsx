import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';
import { ConsoleInput } from '../core/Input';

const Content = styled.div`
  height: 100%;
`;

type ConsoleProps = {
  testCases: TestCase[],
};

// This function refreshes the width of Monaco editor upon change in container size
function Console({ testCases }: ConsoleProps) {
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  });

  return (
    <Content>
      <div>
        {input}
        <ConsoleInput />
      </div>
    </Content>
  );
}

export default Console;
