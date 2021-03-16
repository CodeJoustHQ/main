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

const TitleContent = styled.div`
  //position: absolute;
  padding: 2px;
`;

const ConsoleTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  margin: 0;
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
  const [console, setConsole] = useState('');
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
      setConsole('');
    };

    const handleRun = (newSubmission: Submission) => {
      setTitle('Results');
      setSubtitle('');
      setOutput(newSubmission.results[0].userOutput);
      setConsole(newSubmission.results[0].console);
    };

    const handleSubmit = (newSubmission: Submission) => {
      if (newSubmission.numCorrect === newSubmission.numTestCases) {
        // Set only title and subtitle, leave rest untouched
        setTitle('Correct');
        setSubtitle(`${newSubmission.numCorrect} / ${newSubmission.numTestCases} passed`);
      } else {
        let firstFailure: SubmissionResult | undefined;
        let firstNonHiddenFailure: SubmissionResult | undefined;

        // Find the first incorrect and non-hidden incorrect results
        newSubmission.results.forEach((result) => {
          if (!firstFailure && !result.correct) {
            firstFailure = result;
          }
          if (!firstNonHiddenFailure && !result.correct && !result.hidden) {
            firstNonHiddenFailure = result;
          }
        });

        // Ideally display non-hidden failure but otherwise just any failure
        const res: SubmissionResult = (firstNonHiddenFailure || firstNonHiddenFailure)!;

        // Set state to the latest results
        setTitle('Wrong Answer');
        setSubtitle(`${newSubmission.numCorrect} / ${newSubmission.numTestCases} passed`);
        setInput(res.hidden ? 'Hidden' : res.input);
        setOutput(res.hidden ? 'Hidden' : res.userOutput);
        setConsole(res.hidden ? 'Hidden' : res.console);
      }
    };

    if (submission && submission.results && submission.results.length) {
      if (submission.compilationError) {
        setCompilationError(submission);
      } else if (submission.submissionType === SubmissionType.Submit) {
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
      setConsole('');
    }
  }, [submission]);

  const calculateRows = (val: string): number => (val ? val.split('\n').length : 1);

  return (
    <Content>
      <MainContent>
        <br />
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
          <ConsoleTextArea value={console} rows={calculateRows(console)} readOnly />
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
