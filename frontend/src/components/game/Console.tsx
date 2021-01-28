import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';
import { Text } from '../core/Text';
import { ConsoleTextArea } from '../core/Input';
import { SmallButton } from '../core/Button';
import { SubmissionResult } from '../../api/Game';

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
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

// This function refreshes the width of Monaco editor upon change in size
function Console(props: ConsoleProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const { testCases, submission, onRun } = props;

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  }, [testCases]);

  useEffect(() => {
    setOutput(submission ? `${submission.numCorrect} / ${submission.numTestCases} passed` : '');
  }, [submission]);

  return (
    <Content>
      <FixedContent>
        <SmallButton onClick={() => onRun(input)}>Run Code</SmallButton>
      </FixedContent>
      <div>
        <Text bold>Input</Text>
        <ConsoleTextArea value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div>
        <Text bold>Output</Text>
        <ConsoleTextArea value={output} readOnly />
      </div>
    </Content>
  );
}

export default Console;
