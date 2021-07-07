import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  editProblem,
  getSingleProblem,
  Problem,
} from '../api/Problem';
import { LargeText, MediumText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/editor/ProblemDisplay';
import { generateRandomId } from '../util/Utility';
import { useAppSelector, useProblemEditable } from '../util/Hook';
import { PrimaryButtonLink } from '../components/core/Link';

const Content = styled.div`
  display: flex;
`;

type ProblemParams = {
  id: string,
};

function ProblemPage() {
  const { firebaseUser, token } = useAppSelector((state) => state.account);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const problemEditable = useProblemEditable(firebaseUser, problem);
  const params = useParams<ProblemParams>();

  useEffect(() => {
    if (!token) {
      return;
    }

    // Checks added to ensure problem fetched only once.
    if (!problem && !loading) {
      setLoading(true);
      getSingleProblem(params.id, token!)
        .then((res) => {
          res.testCases.forEach((testCase) => {
            // eslint-disable-next-line no-param-reassign
            testCase.id = generateRandomId();
          });
          setProblem(res);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [params, token, problem, loading]);

  if (!problem) {
    if (error && !loading) {
      return (
        <MediumText>
          You do not have permission to view this problem, or the problem does not exist.
          <br />
          <PrimaryButtonLink to="/problems/all">Go Back</PrimaryButtonLink>
        </MediumText>
      );
    }

    return <Loading />;
  }

  const handleEdit = (newProblem: Problem) => {
    if (!token) {
      setError('An error occurred fetching your credentials; '
        + 'please try again in a few seconds.');
      return;
    }

    setLoading(true);
    setError('');
    editProblem(newProblem.problemId, newProblem, token!)
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
      <LargeText>{problemEditable ? 'Edit Problem' : 'Preview Problem'}</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
      <Content>
        <ProblemDisplay problem={problem!} onClick={handleEdit} actionText="Save" editMode />
      </Content>
    </>
  );
}

export default ProblemPage;
