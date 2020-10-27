import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';
import { BoldText } from '../core/Text';
import { ConsoleTextArea } from '../core/Input';

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
  }, [testCases]);

  return (
    <Content>
      <div>
        <BoldText>Input</BoldText>
        <ConsoleTextArea value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
    </Content>
  );
}

export default Console;
