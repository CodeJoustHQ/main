import React, { useState } from 'react';
import { PrimaryButton } from '../components/core/Button';
import Input from '../components/core/Input';
import {
  connect, disconnect, sendUser, SOCKET_ENDPOINT,
} from '../api/Socket';

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
      <PrimaryButton onClick={() => sendUser(nickname)}>
        Send User Information
      </PrimaryButton>
    </div>
  );
}

export default JoinGamePage;
