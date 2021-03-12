import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { editProblem, getSingleProblem, Problem } from '../api/Problem';
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

  useEffect(() => {
    getSingleProblem(params.id)
      .then((res) => {
        setProblem(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params]);

  if (!problem) {
    if (loading) {
      return <Loading />;
    }
    return <NotFound />;
  }

  const handleEdit = (newProblem: Problem) => {
    setLoading(true);
    setError('');

    editProblem(newProblem.problemId, newProblem)
      .then((res) => {
        setProblem(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <Content>
      <LargeText>Edit Problem</LargeText>
      <ProblemDisplay problem={problem!} onClick={handleEdit} actionText="Save" editMode />

      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
    </Content>
  );
}

export default ProblemPage;
