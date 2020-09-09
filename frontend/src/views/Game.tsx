import Editor from '@monaco-editor/react';
import React from 'react';
import { Problem, getProblems } from '../api/Problem';
import styles from './styles.module.css';
import Header from '../components/navigation/Header';
import { Text, ProblemHeaderText } from '../components/core/Text';

interface GameState {
  problems?: Problem[];
}

interface GameProps {}

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
        <div className={styles.problemPanel}>
          <ProblemHeaderText>{ firstProblem?.name }</ProblemHeaderText>
          <Text>{ firstProblem?.description}</Text>
        </div>
        <div className={styles.editorPanel}>
          <Editor height="90vh" language="javascript" />
        </div>
      </div>
    );
  }
}

export default GamePage;
