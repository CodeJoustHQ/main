import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    setInterval(this.hello, 250);
  }

  hello = () => {
    fetch('/hello')
      .then((response) => response.text())
      .then((message) => {
        this.setState({ message });
      });
  };

  render() {
    const { message } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{message}</h1>
        </header>
        <p className="App-intro">
          To get started, edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
