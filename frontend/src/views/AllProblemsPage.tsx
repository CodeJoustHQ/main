import React, { useEffect, useState } from 'react';
import { getProblems, Problem } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemCard from '../components/card/ProblemCard';

function AllProblemsPage() {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems()
      .then((res) => {
        setProblems(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <LargeText>View All Problems</LargeText>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      {problems?.forEach((problem) =>
        <ProblemCard problem={problem} />
      )}
    </div>
  );
}

export default AllProblemsPage;
