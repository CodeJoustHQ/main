import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProblems, Problem } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import { useAppSelector } from '../util/Hook';
import { TextLink } from '../components/core/Link';
import FilteredProblemList from '../components/problem/FilteredProblemList';

const Content = styled.div`
  padding: 0 20%;
`;

function AllProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);
    getProblems(token!, true)
      .then((res) => setProblems(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Content>
      <LargeText>View All Problems</LargeText>
      <TextLink to="/problem/create">Create new problem</TextLink>

      <FilteredProblemList problems={problems} />

      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }
    </Content>
  );
}

export default AllProblemsPage;
