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

const FlexContainer = styled.div`
  display: flex;
  top: 50px;
`;

const FlexPanel = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #e3e3e3;
  overflow: none;
  height: 100vh;
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
        <FlexContainer>
          <FlexPanel>
            <ProblemHeaderText>{ firstProblem?.name }</ProblemHeaderText>
            <Text>{ firstProblem?.description}</Text>
          </FlexPanel>
          <FlexPanel>
            <Editor height="100vh" language="javascript" />
          </FlexPanel>
        </FlexContainer>
      </div>
    );
  }
}

export default GamePage;
