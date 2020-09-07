import React, { useState } from 'react';
import { PrimaryButton } from '../components/core/Button';
import Input from '../components/core/Input';
import { connect, disconnect, sendMessage } from '../api/Socket';

// Create constants for the subscription and send message URLs.
const SOCKET_ENDPOINT:string = '/api/v1/socket/join-room-endpoint';

function JoinGamePage() {
  // Declare nickname state variable.
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <Input placeholder="Enter your nickname" onChange={(event) => setNickname(event.target.value)} />
      <PrimaryButton id="connect_socket" onClick={() => connect(SOCKET_ENDPOINT, nickname)}>
        Connect
      </PrimaryButton>
      <PrimaryButton onClick={disconnect}>
        Disconnect
      </PrimaryButton>
      <PrimaryButton onClick={() => sendMessage(nickname)}>
        Send a Message
      </PrimaryButton>
    </div>
  );
}

// Next task: disable primary button connect if input has no text.

export default JoinGamePage;
