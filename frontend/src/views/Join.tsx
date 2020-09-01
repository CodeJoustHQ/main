import React from 'react';
import { SocketButtonConnection } from '../components/core/Link';

function connect() {
  console.log('Connect');
}

function disconnect() {
  console.log('Disconnect');
}

function JoinGamePage() {
  return (
    <div>
      <SocketButtonConnection onClick={connect}>
        Connect
      </SocketButtonConnection>
      <SocketButtonConnection onClick={disconnect}>
        Disconnect
      </SocketButtonConnection>
    </div>
  );
}

export default JoinGamePage;
