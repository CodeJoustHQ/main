import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import Editor from '../components/core/Editor';
import { ErrorResponse } from '../api/Error';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import {
  FlexContainer, FlexInfoBar, Panel, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText, Text } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState } from '../util/Utility';

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
    if (checkLocationState(location, 'room')) {
      setRoom(location.state.room);
    }
    getProblems().then((res) => {
      if (!(res as Problem[]).length) {
        setError('Problem cannot be found');
      } else {
        setProblems(res as Problem[]);
        setError('');
      }
    }).catch((err) => {
      setError((err as ErrorResponse).message);
      setProblems([]);
    });
  }, [location]);

  const firstProblem = problems?.[0];

  // Creates Event when splitter bar is dragged
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
          <Panel>
            <ProblemHeaderText>{firstProblem?.name}</ProblemHeaderText>
            <Text>{firstProblem?.description}</Text>
            {error ? <ErrorMessage message={error} /> : null}
          </Panel>
          <Panel>
            <Editor />
          </Panel>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
