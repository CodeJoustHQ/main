import React from 'react';
import { SocketButtonConnection } from '../components/core/Link';
import { Connect, Disconnect } from '../util/Utility';

function JoinGamePage() {
  return (
    <div>
      <SocketButtonConnection onClick={() => Connect('/join-room-endpoint')}>
        Connect
      </SocketButtonConnection>
      <SocketButtonConnection onClick={Disconnect}>
        Disconnect
      </SocketButtonConnection>
    </div>
  );
}

export default JoinGamePage;
