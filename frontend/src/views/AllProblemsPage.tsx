import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getProblems, Problem } from '../api/Problem';
import { Text, LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemCard from '../components/card/ProblemCard';
import { useAppSelector } from '../util/Hook';
import { verifyToken } from '../util/Utility';

const Content = styled.div`
  padding: 0 20%;
`;

const TextLinkLocation = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`;

function AllProblemsPage() {
  const history = useHistory();
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!verifyToken(token, setError)) {
      return;
    }

    setLoading(true);
    getProblems(token!)
      .then((res) => setProblems(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const redirect = (problemId: string) => {
    history.push(`/problem/${problemId}`);
  };

  return (
    <Content>
      <LargeText>View All Problems</LargeText>
      <TextLinkLocation
        onClick={() => {
          history.push('/problem/create');
        }}
      >
        Create new problem
      </TextLinkLocation>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      {problems?.map((problem, index) => (
        <ProblemCard
          key={index}
          problem={problem}
          onClick={redirect}
        />
      ))}
    </Content>
  );
}

export default AllProblemsPage;
