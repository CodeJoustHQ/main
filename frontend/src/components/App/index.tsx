import React, { Component } from 'react';
import styled from 'styled-components';
import fetchHello from '../../api/hello';
import Editor from "@monaco-editor/react";

const StyledApp = styled.div`
  text-align: center;
  
  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }
  
  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

type MyProps = {};

type MyState = {
  message: String,
};

class App extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.state = { message: 'Loading' };
  }

  componentDidMount() {
    this.hello();
    setInterval(this.hello, 250);
  }

  hello = () => {
    fetchHello()
      .then((res) => {
        this.setState({ message: res.message });
      });
  };

  render() {

    return (
      <StyledApp className="App">

        <p className="App-intro">
          To get started, edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <Editor height="90vh" language="javascript"/>
      </StyledApp>
    );
  }
}

export default App;
