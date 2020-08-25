import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/navigation/Header';

const Content = styled.div`
  width: 80%;
  margin: 10%;
  text-align: center;
  font-size: large;
`;

function LandingPage() {
  // Example usage of React Hooks
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <Content>
        <p>
          This is our landing page. You clicked the button
          {` ${count} `}
          times.
        </p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </Content>
    </div>
  );
}

export default LandingPage;
