import React, { useState } from 'react';
import { PrimaryButton } from '../components/core/Button';
import Input from '../components/core/Input';
import { connect, disconnect, sendGreeting } from '../api/Socket';

// Create constants for the subscription and send message URLs.
const SOCKET_ENDPOINT:string = '/api/v1/socket/join-room-endpoint';

function JoinGamePage() {
  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <Input placeholder="Enter your nickname" onChange={(event) => setNickname(event.target.value)} />
      <PrimaryButton onClick={() => connect(SOCKET_ENDPOINT, nickname)}>
        Connect
      </PrimaryButton>
      <PrimaryButton onClick={disconnect}>
        Disconnect
      </PrimaryButton>
      <PrimaryButton onClick={() => sendGreeting(nickname)}>
        Send a Greeting
      </PrimaryButton>
    </div>
  );
}

export default JoinGamePage;
