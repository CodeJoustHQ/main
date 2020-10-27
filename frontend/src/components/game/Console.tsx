import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SubmissionResult, TestCase } from '../../api/Problem';
import { BoldText } from '../core/Text';
import { ConsoleTextArea } from '../core/Input';

const Content = styled.div`
  height: 100%;
`;

type ConsoleProps = {
  testCases: TestCase[],
  submission: SubmissionResult | null,
};

// This function refreshes the width of Monaco editor upon change in container size
function Console({ testCases, submission }: ConsoleProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  }, [testCases]);

  useEffect(() => {
    setOutput(submission ? submission.output : '');
  }, [submission]);

  return (
    <Content>
      <div>
        <BoldText>Input</BoldText>
        <ConsoleTextArea value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div>
        <BoldText>Output</BoldText>
        <ConsoleTextArea value={output} readOnly />
      </div>
    </Content>
  );
}

export default Console;
