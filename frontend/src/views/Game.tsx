import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorResponse, isError } from '../api/Error';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import { FlexContainer, FlexInfoBar, FlexPanel } from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ErrorText, ProblemHeaderText, Text } from '../components/core/Text';
import Header from '../components/navigation/Header';

type LocationState = {
  room: Room,
}

function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Called every time location changes
  useEffect(() => {
    if (location && location.state && location.state.room) {
      setRoom(location.state.room);
    }
    getProblems().then((res) => {
      if (isError(res)) {
        setError((res as ErrorResponse).message);
        setProblems(null);
      } else {
        setProblems(res as Problem[]);
        setError(null);
      }
    });
  }, [location]);

  const firstProblem = problems?.[0];

  return (
    <div>
      <FlexContainer>
        <Header />
        <FlexInfoBar>
          Room:
          {' '}
          {room ? room.roomId : 'No room joined'}
        </FlexInfoBar>
        <FlexPanel>
          <ProblemHeaderText>{ firstProblem?.name }</ProblemHeaderText>
          <Text>{ firstProblem?.description }</Text>
          <ErrorText>{error ? <ErrorMessage message={error} /> : null}</ErrorText>
        </FlexPanel>
        <FlexPanel>
          <Editor height="100vh" language="javascript" />
        </FlexPanel>
      </FlexContainer>
    </div>
  );
}

export default GamePage;
