import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import { useBeforeunload } from 'react-beforeunload';
import Editor, { languages } from '../components/game/Editor';
import { Problem, SubmissionResult, getRandomProblem } from '../api/Problem';
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
import Difficulty from '../api/Difficulty';
import { Game, getGame } from '../api/Game';

type LocationState = {
  roomId: string,
  currentUser: User,
  difficulty: Difficulty,
}

function GamePage() {
  // Get history object to be able to move between different pages
  const history = useHistory();
  const location = useLocation<LocationState>();
  const language = useRef('Java');
  const code = useRef('');

  const [problem, setProblem] = useState<Problem | null>(null);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [game, setGame] = useState<Game | null>(null);

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
    if (checkLocationState(location, 'roomId', 'currentUser', 'difficulty')) {
      setCurrentUser(location.state.currentUser);
      setRoomId(location.state.roomId);

      // Get a random problem.
      const request = { difficulty: location.state.difficulty };
      getRandomProblem(request).then((res) => {
        setFullPageLoading(false);
        setProblem(res);
      }).catch((err) => {
        setFullPageLoading(false);
        setError(err.message);
      });

      // Get game object with room details
      getGame(location.state.roomId)
        .then((res) => {
          setGame(res);
          console.log(res);
        })
        .catch((err) => setError(err));
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
    if (language.current === 'javascript') {
      console.log(eval(code.current)); // eslint-disable-line no-eval
    }
  };

  // Callback when code language is changed
  const onLanguageChange = (input: string) => {
    language.current = input;
  };

  const onCodeUpdate = (input: string) => {
    code.current = input;
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
        {` (${game?.roomDto?.users?.length} players)`}
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
              <Editor
                onLanguageChange={onLanguageChange}
                onCodeUpdate={onCodeUpdate}
                problem={problem}
              />
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
