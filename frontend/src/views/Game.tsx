import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import Editor from '../components/game/Editor';
import { Problem, getProblems, SubmissionResult } from '../api/Problem';
import { errorHandler } from '../api/Error';
import {
  MainContainer, FlexContainer, FlexInfoBar, Panel, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText, Text } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState } from '../util/Utility';
import Console from '../components/game/Console';
import Loading from '../components/core/Loading';
import { User } from '../api/User';

type LocationState = {
  roomId: string,
  currentUser: User,
}

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  const [fullPageLoading, setFullPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Display beforeUnload message to inform the user that they may lose
   * their code / data if they leave the page.
   * Some browsers will display this message, others will display a fixed
   * message; see https://github.com/jacobbuck/react-beforeunload.
   */
  useBeforeunload(() => 'Leaving this page may cause you to lose your current code and data.');

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get the game problem.
      getProblems().then((res) => {
        setFullPageLoading(false);

        if (!res.length) {
          setError('Problem cannot be found');
        } else {
          setProblem(res[0]);
        }
      }).catch((err) => {
        setFullPageLoading(false);
        setError(err.message);
      });
    } else {
      history.replace('/game/join', {
        error: errorHandler('No valid room details were provided, so you could not view the game page.'),
      });
    }
  }, [location, history]);

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
  };

  // Callback when user runs code against custom test case
  const runSolution = (input: string) => {
    // Needs to be implemented
    const tempSubmission = { status: 'SUCCESS', output: input };
    setSubmission(tempSubmission);
  };

  // If the page is loading, return a centered Loading object.
  if (fullPageLoading) {
    return (
      <MainContainer>
        <Loading />
      </MainContainer>
    );
  }

  return (
    <FlexContainer>
      <FlexInfoBar>
        Room:
        {' '}
        {roomId || 'An unknown room'}
      </FlexInfoBar>
      <FlexInfoBar>
        You are
        {' '}
        {currentUser != null ? currentUser.nickname : 'An unknown user'}
      </FlexInfoBar>

      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
        >
          {/* Problem title/description panel */}
          <Panel>
            <ProblemHeaderText>{problem?.name}</ProblemHeaderText>
            <Text>{problem?.description}</Text>
            {error ? <ErrorMessage message={error} /> : null}
          </Panel>

          {/* Code editor and console panels */}
          <SplitterLayout
            percentage
            vertical
            primaryMinSize={20}
            secondaryMinSize={1}
          >
            <Panel>
              <Editor />
            </Panel>

            <Panel>
              <Console
                testCases={problem?.testCases!}
                submission={submission}
                onRun={runSolution}
              />
            </Panel>
          </SplitterLayout>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
