import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import {
  createProblem,
  Problem,
  ProblemIOType,
} from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/editor/ProblemDisplay';
import { Difficulty } from '../api/Difficulty';
import { useAppSelector } from '../util/Hook';

const Content = styled.div`
  display: flex;
`;

function CreateProblemPage() {
  const history = useHistory();
  const { firebaseUser, token } = useAppSelector((state) => state.account);

  const firstProblem = {
    problemId: '',
    name: '',
    owner: { uid: firebaseUser?.uid || 'n/a' },
    description: '',
    verified: false,
    difficulty: Difficulty.Easy,
    testCases: [],
    problemInputs: [],
    problemTags: [],
    outputType: ProblemIOType.Integer,
  };

  const [problem, setProblem] = useState<Problem>(firstProblem);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (newProblem: Problem) => {
    setLoading(true);
    setError('');

    createProblem(newProblem, token || '')
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
    <>
      <LargeText>Create Problem</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
      <Content>
        <ProblemDisplay problem={problem!} onClick={handleSubmit} actionText="Create" editMode={false} />
      </Content>
    </>
  );
}

export default CreateProblemPage;
