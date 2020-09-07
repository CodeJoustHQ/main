import React from 'react';
import { PrimaryButton } from '../components/core/Button';
import { connect, disconnect, sendMessage } from '../api/Socket';

// Create constants for the subscription and send message URLs.
const SOCKET_ENDPOINT:string = '/api/v1/socket/join-room-endpoint';

function JoinGamePage() {
  return (
    <div>
      <PrimaryButton onClick={() => connect(SOCKET_ENDPOINT)}>
        Connect
      </PrimaryButton>
      <PrimaryButton onClick={disconnect}>
        Disconnect
      </PrimaryButton>
      <PrimaryButton onClick={sendMessage}>
        Send a Message
      </PrimaryButton>
    </div>
  );
}

export default JoinGamePage;
