import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Room } from '../api/Room';

type LocationState = {
  room: Room,
}

function GamePage() {
  const location = useLocation<LocationState>();
  const [room, setRoom] = useState<Room | null>(null);

  // Called every time location changes
  useEffect(() => {
    if (location && location.state && location.state.room) {
      setRoom(location.state.room);
    }
  }, [location]);

  return (
    <div>
      Room:
      {' '}
      {room ? room.roomId : 'No room joined'}
      <Editor height="90vh" language="javascript" />
    </div>
  );
}

export default GamePage;
