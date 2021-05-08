import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  editProblem,
  getSingleProblem,
  Problem,
} from '../api/Problem';
import NotFound from './NotFound';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/ProblemDisplay';
import { generateRandomId } from '../util/Utility';
import { useAppSelector } from '../util/Hook';

const Content = styled.div`
  display: flex;
`;

type ProblemParams = {
  id: string,
};

function ProblemPage() {
  const { token } = useAppSelector((state) => state.account);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams<ProblemParams>();

  useEffect(() => {
    setLoading(true);
    getSingleProblem(params.id)
      .then((res) => {
        res.testCases.forEach((testCase) => {
          // eslint-disable-next-line no-param-reassign
          testCase.id = generateRandomId();
        });
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

    editProblem(newProblem.problemId, newProblem, token || '')
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
    <>
      <LargeText>Edit Problem</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
      <Content>
        <ProblemDisplay problem={problem!} onClick={handleEdit} actionText="Save" editMode />
      </Content>
    </>
  );
}

export default ProblemPage;
