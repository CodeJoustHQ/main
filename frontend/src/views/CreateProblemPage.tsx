import React, { useState } from 'react';
import styled from 'styled-components';
import { createProblem, Problem, ProblemIOType } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/ProblemDisplay';
import Difficulty from '../api/Difficulty';
import { useHistory } from 'react-router-dom';

const Content = styled.div`
  padding: 0 20%;
`;

function CreateProblemPage() {
  const firstProblem = {
    problemId: '',
    name: 'Name',
    description: 'Description',
    difficulty: Difficulty.Easy,
    testCases: [],
    problemInputs: [],
    outputType: ProblemIOType.Integer,
  };

  const history = useHistory();
  const [problem, setProblem] = useState<Problem>(firstProblem);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSubmit = (newProblem: Problem) => {
    setLoading(true);

    createProblem(newProblem)
      .then((res) => {
        setProblem(res);
        setLoading(false);

        history.replace(`/problem/${res.problemId}`);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <Content>
      <LargeText>Create Problem</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <ProblemDisplay problem={problem!} onClick={handleSubmit} />
    </Content>
  );
}

export default CreateProblemPage;
