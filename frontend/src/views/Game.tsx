import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SplitterLayout from 'react-splitter-layout';
import Editor from '../components/game/Editor';
import { Problem, getProblems } from '../api/Problem';
import { Room } from '../api/Room';
import {
  FlexContainer, FlexInfoBar, Panel, SplitterContainer,
} from '../components/core/Container';
import ErrorMessage from '../components/core/Error';
import { ProblemHeaderText, Text } from '../components/core/Text';
import 'react-splitter-layout/lib/index.css';
import { checkLocationState } from '../util/Utility';
import Console from '../components/game/Console';

type LocationState = {
  room: Room,
}

function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState<string>('');

  // Called every time location changes
  useEffect(() => {
    if (checkLocationState(location, 'room')) {
      setRoom(location.state.room);
    }
    getProblems()
      .then((res) => {
        if (!res.length) {
          setError('Problem cannot be found');
        } else {
          setProblem(res[0]);
          setError('');
        }
      }).catch((err) => setError(err.message));
  }, [location]);

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
            secondaryMinSize={2}
          >
            <Panel>
              <Editor />
            </Panel>

            <Panel>
              <Console />
            </Panel>
          </SplitterLayout>
        </SplitterLayout>
      </SplitterContainer>
    </FlexContainer>
  );
}

export default GamePage;
