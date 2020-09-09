import Editor from '@monaco-editor/react';
import React from 'react';
import styled from 'styled-components';
import { Problem, getProblems } from '../api/problem';
import Header from '../components/navigation/Header';
import { Text, ProblemHeaderText } from '../components/core/Text';

interface GameState {
  problems?: Problem[];
}

interface GameProps {}

const ProblemPanel = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  bottom: 0;
  width: 50vw;
  background-color: #e3e3e3;
  padding: 50px;
`;

const EditorPanel = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  bottom: 0;
  width: 50vw;
`;

class GamePage extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getProblems().then((problems) => {
      this.setState({ problems });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { problems } = this.state;
    const firstProblem = problems?.[0];
    return (
      <div>
        <Header />
        <ProblemPanel>
          <ProblemHeaderText>{ firstProblem?.name }</ProblemHeaderText>
          <Text>{ firstProblem?.description}</Text>
        </ProblemPanel>
        <EditorPanel>
          <Editor height="90vh" language="javascript" />
        </EditorPanel>
      </div>
    );
  }
}

export default GamePage;
