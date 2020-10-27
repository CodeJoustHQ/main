import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SubmissionResult, TestCase } from '../../api/Problem';
import { BoldText } from '../core/Text';
import { ConsoleTextArea } from '../core/Input';
import { SmallButton } from '../core/Button';

const Content = styled.div`
  height: 100%;
`;

const FixedContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

type ConsoleProps = {
  testCases: TestCase[],
  submission: SubmissionResult | null,
  onRun: (input: string) => void,
};

// This function refreshes the width of Monaco editor upon change in container size
function Console(props: ConsoleProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const { testCases, submission, onRun } = props;

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  }, [testCases]);

  useEffect(() => {
    setOutput(submission ? submission.output : '');
  }, [submission]);

  return (
    <Content>
      <FixedContent>
        <SmallButton onClick={() => onRun(input)}>Run Code</SmallButton>
      </FixedContent>
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
