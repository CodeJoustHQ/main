import React from 'react';
import { PrimaryButton } from '../components/core/Button';
import { connect, disconnect } from '../api/Socket';

function JoinGamePage() {
  return (
    <div>
      <PrimaryButton onClick={() => connect('/join-room-endpoint')}>
        Connect
      </PrimaryButton>
      <PrimaryButton onClick={disconnect}>
        Disconnect
      </PrimaryButton>
    </div>
  );
}

export default JoinGamePage;
