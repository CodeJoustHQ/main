import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';
import { Text } from '../core/Text';
import { ConsoleTextArea } from '../core/Input';
import { SmallButton } from '../core/Button';
import { Submission, SubmissionResult, SubmissionType } from '../../api/Game';

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const FixedContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.6rem;
`;

type ConsoleProps = {
  testCases: TestCase[],
  submission: Submission | null,
  onRun: (input: string) => void,
  onSubmit: () => void,
};

// This function refreshes the width of Monaco editor upon change in size
function Console(props: ConsoleProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const {
    testCases, submission, onRun, onSubmit,
  } = props;

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  }, [testCases]);

  useEffect(() => {
    if (submission) {
      // Set the submission details in the output, a list joined by new line.
      const outputList: string[] = [];

      // Add submission correctness.
      if (submission.submissionType === SubmissionType.Submit) {
        outputList.push(`${submission.numCorrect} / ${submission.numTestCases} passed`);
      }

      // If a compilation error exists, show that; otherwise, show results.
      if (submission.compilationError) {
        outputList.push(`Compilation error: ${submission.compilationError}`);
      } else {
        outputList.push(`Runtime: ${submission.runtime}`);
        let resultIndex: number = 1;
        submission.results.forEach((result: SubmissionResult) => {
          // Only show newline, result #, and correctness if type was 'submit'.
          if (submission.submissionType === SubmissionType.Submit) {
            outputList.push('');
            outputList.push(`Result #${resultIndex}: ${result.correct ? 'Correct' : 'Incorrect'}`);
          }

          // Show the test case details, if not hidden.
          if (result.hidden) {
            outputList.push('This test case is hidden.');
          } else {
            outputList.push(`Input: ${result.input}`);
            outputList.push(`User output: ${result.userOutput}`);

            // Only show correct output if type was 'submit'.
            if (submission.submissionType === SubmissionType.Submit) {
              outputList.push(`Correct output: ${result.correctOutput}`);
            }
            outputList.push(`Console: ${result.console}`);
            outputList.push(`Error: ${result.error}`);
          }

          resultIndex += 1;
        });
      }

      setOutput(outputList.join('\n'));
    }
  }, [submission]);

  return (
    <Content>
      <FixedContent>
        <SmallButton onClick={() => onRun(input)}>Run Code</SmallButton>
        <SmallButton onClick={() => onSubmit()}>Submit</SmallButton>
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
