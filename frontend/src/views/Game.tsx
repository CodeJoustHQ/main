import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ErrorResponse, isError } from '../api/Error';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import ErrorMessage from '../components/core/Error';
import { ErrorText, ProblemHeaderText, Text } from '../components/core/Text';
import Header from '../components/navigation/Header';

type LocationState = {
  room: Room,
}

const FlexContainer = styled.div`
  display: flex;
`;

const FlexPanel = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #e3e3e3;
  overflow: none;
`;

function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[] | null>(null);

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
      <Header />
      <Text>
        Room:
        {' '}
        {room ? room.roomId : 'No room joined'}
      </Text>
      <FlexContainer>
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
