import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import { Text, ProblemHeaderText } from '../components/core/Text';
import Header from '../components/navigation/Header';

type LocationState = {
  room: Room,
}

const FlexContainer = styled.div`
  display: flex;
  top: 50px;
`;

const FlexPanel = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #e3e3e3;
  overflow: none;
  height: 100vh;
  width: 50vw;
`;

export default function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);

  const [problems, setProblems] = useState<Problem[] | null>(null)

  // Called every time location changes
  useEffect(() => {
    if (location && location.state && location.state.room) {
      setRoom(location.state.room);
    }
    getProblems().then((response) => {
      setProblems(response);
    }).catch((error) => {
      console.log(error);
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
        </FlexPanel>
        <FlexPanel>
          <Editor height="100vh" language="javascript" />
        </FlexPanel>
      </FlexContainer>
    </div>
  );
}
