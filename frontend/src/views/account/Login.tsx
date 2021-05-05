import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from '../../util/Hook';
import { TextInput } from '../../components/core/Input';

function LoginPage() {
  const { account } = useAppSelector((state) => state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (account) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <div>
        <TextInput
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
}

export default LoginPage;
