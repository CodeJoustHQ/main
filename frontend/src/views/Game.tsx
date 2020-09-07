import Editor from '@monaco-editor/react';
import React from 'react';
import { Problem, getProblems } from '../api/problem'
import styles from './styles.module.css'

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
    getProblems().then(problems => {
      this.setState({problems: problems});
      console.log(problems)
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    var firstProblem = this.state.problems?.[0];
    return (
      <div>
        <div className={styles.header}><h3>Game page</h3></div>
        {/*
        {this.state.problems?.map(problem => {
          return (<div>
          <h3>{ problem.name }</h3>
          <p>{ problem.description }</p>
          </div>);
        })}
        */}
        <div className={styles.problemPanel}>        
          <h3>{ firstProblem?.name }</h3>
          <p>{ firstProblem?.description}</p>
        </div>
        <div className={styles.editorPanel}>
          <Editor height="90vh" language="javascript" />
        </div>
      </div>
    );
  }
}

export default GamePage;
