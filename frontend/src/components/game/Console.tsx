import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../api/Problem';
import { ConsoleTextArea } from '../core/Input';
import { GreenSmallButton, SmallButton } from '../core/Button';
import { Submission, SubmissionResult, SubmissionType } from '../../api/Game';

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
`;

const FlexContent = styled.div`
  display: flex;
  margin: 10px 0;
`;

const ConsoleTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  margin: 0;
`;

const ConsoleSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin: 0 0 5px 0;
`;

const ConsoleLabel = styled.p`
  flex: 0 0 60px;
  margin: auto 0;
`;

const RightAlignedContent = styled.div`
  position: absolute;
  text-align: right;
  top: 0;
  right: 10px;
  margin: 10px 0;
`;

const MainContent = styled.div`
  width: 80%;
  padding: 10px 0;
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
  const [consoleOutput, setConsoleOutput] = useState('');
  const [title, setTitle] = useState('Console');
  const [subtitle, setSubtitle] = useState('');

  const {
    testCases, submission, onRun, onSubmit,
  } = props;

  useEffect(() => {
    setInput(testCases?.length ? testCases[0].input : '');
  }, [testCases]);

  useEffect(() => {
    const setCompilationError = (newSubmission: Submission) => {
      // If it's a compilation error, no subtitle or console
      setTitle('Compilation Error');
      setSubtitle('');
      setOutput(newSubmission.compilationError);
      setConsoleOutput('');
    };

    const handleRun = (newSubmission: Submission) => {
      const res = newSubmission.results[0];
      setTitle(res.error ? 'Runtime Error' : 'Results');
      setSubtitle('');
      setOutput(res.error || res.userOutput.trim());
      setConsoleOutput(res.console);
    };

    const handleSubmit = (newSubmission: Submission) => {
      if (newSubmission.numCorrect === newSubmission.numTestCases) {
        // Set only title and subtitle, clear console/output
        setTitle('Correct');
        setSubtitle(`${newSubmission.numCorrect} / ${newSubmission.numTestCases} passed`);
        setOutput('');
        setConsoleOutput('');
      } else {
        let firstNonHiddenFailure: SubmissionResult | undefined;

        // Find the first non-hidden incorrect results
        newSubmission.results.forEach((result) => {
          if (!firstNonHiddenFailure && !result.correct && !result.hidden) {
            firstNonHiddenFailure = result;
          }
        });

        if (firstNonHiddenFailure) {
          // Set state to the first non-hidden results if it exists
          setTitle(firstNonHiddenFailure.error ? 'Runtime Error' : 'Wrong Answer');
          setSubtitle(`${newSubmission.numCorrect} / ${newSubmission.numTestCases} passed`);
          setInput(firstNonHiddenFailure.input);
          setOutput(firstNonHiddenFailure.error || firstNonHiddenFailure.userOutput.trim());
          setConsoleOutput(firstNonHiddenFailure.console);
        } else {
          // Set state to default hidden failure message if no non-hidden results are found
          setTitle('Runtime Error or Wrong Answer');
          setSubtitle(`${newSubmission.numCorrect} / ${newSubmission.numTestCases} passed`);
          setInput('hidden');
          setOutput('hidden');
          setConsoleOutput('hidden');
        }
      }
    };

    if (submission && submission.compilationError) {
      setCompilationError(submission);
    } else if (submission && submission.results && submission.results.length) {
      if (submission.submissionType === SubmissionType.Submit) {
        handleSubmit(submission);
      } else {
        handleRun(submission);
      }
    } else {
      // Default values
      setTitle('Console');
      setSubtitle('');
      setInput(testCases[0].input);
      setOutput('');
      setConsoleOutput('');
    }
  }, [submission, testCases]);

  const calculateRows = (val: string): number => (val ? val.split('\n').length : 1);

  return (
    <Content>
      <MainContent>
        <ConsoleTitle>{title}</ConsoleTitle>
        <ConsoleSubtitle>{subtitle}</ConsoleSubtitle>
        <FlexContent>
          <ConsoleLabel>Input</ConsoleLabel>
          <ConsoleTextArea
            rows={calculateRows(input)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </FlexContent>
        <FlexContent>
          <ConsoleLabel>Output</ConsoleLabel>
          <ConsoleTextArea value={output} rows={calculateRows(output)} readOnly />
        </FlexContent>
        <FlexContent>
          <ConsoleLabel>Console</ConsoleLabel>
          <ConsoleTextArea value={consoleOutput} rows={calculateRows(consoleOutput)} readOnly />
        </FlexContent>
        <br />
      </MainContent>
      <RightAlignedContent>
        <GreenSmallButton onClick={() => onRun(input)}>Run Code</GreenSmallButton>
        <SmallButton onClick={() => onSubmit()}>Submit</SmallButton>
      </RightAlignedContent>
    </Content>
  );
}

export default Console;
