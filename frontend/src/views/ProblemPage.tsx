import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getSingleProblem, Problem } from '../api/Problem';
import NotFound from './NotFound';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/ProblemDisplay';

const Content = styled.div`
  padding: 0 20%;
`;

type ProblemParams = {
  id: string,
};

function ProblemPage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const params = useParams<ProblemParams>();

  if (!params.id) {
    return <NotFound />;
  }

  getSingleProblem(params.id)
    .then((res) => {
      setProblem(res);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });

  if (!problem) {
    return <NotFound />;
  }

  return (
    <Content>
      <LargeText>Problem</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <ProblemDisplay problem={problem!} />
    </Content>
  );
}

export default ProblemPage;
