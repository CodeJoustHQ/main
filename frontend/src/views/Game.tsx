import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import Editor from '../components/core/Editor';
import { ErrorResponse, isError } from '../api/Error';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import {
  FlexContainer, FlexInfoBar, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText, Text } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';

type LocationState = {
  room: Room,
}

function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string>('');

  // Called every time location changes
  useEffect(() => {
    if (location && location.state && location.state.room) {
      setRoom(location.state.room);
    }
    getProblems().then((res) => {
      if (isError(res)) {
        setError((res as ErrorResponse).message);
        setProblems([]);
      } else if (!(res as Problem[]).length) {
        setError('Problem cannot be found');
      } else {
        setProblems(res as Problem[]);
        setError('');
      }
    });
  }, [location]);

  const firstProblem = problems?.[0];

  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
  };

  return (
    <FlexContainer>
      <FlexInfoBar>
        Room:
        {' '}
        {room ? room.roomId : 'No room joined'}
      </FlexInfoBar>
      <SplitterContainer>
        <SplitterLayout
          onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
          percentage
          primaryMinSize={20}
          secondaryMinSize={35}
        >
          <div>
            <ProblemHeaderText>{firstProblem?.name}</ProblemHeaderText>
            <Text>{firstProblem?.description}</Text>
            {error ? <ErrorMessage message={error} /> : null}
          </div>
          <div>
            <Editor height="100vh" language="javascript" />
          </div>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
