import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProblems } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import { TextLink } from '../components/core/Link';
import FilteredProblemList from '../components/problem/FilteredProblemList';
import { useAppDispatch, useAppSelector } from '../util/Hook';
import { setVerifiedProblems } from '../redux/Problem';

const Content = styled.div`
  padding: 0 20%;
`;

function VerifiedProblemsPage() {
  const dispatch = useAppDispatch();
  const { verifiedProblems } = useAppSelector((state) => state.problem);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);
    getProblems(token!, true)
      .then((res) => dispatch(setVerifiedProblems(res)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, dispatch]);

  return (
    <Content>
      <LargeText>Verified Problems</LargeText>
      <TextLink to="/game/create">Create new problem &#8594;</TextLink>

      <FilteredProblemList problems={verifiedProblems} />

      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
    </Content>
  );
}

export default VerifiedProblemsPage;
