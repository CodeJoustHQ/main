import React, { useEffect, useState } from 'react';
import { getProblems, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';

function ProblemSelector() {
  const [error, setError] = useState<string>('');
  const [problems, setProblems] = useState<SelectableProblem[]>([]);

  useEffect(() => {
    getProblems()
      .then((res) => {
        setProblems(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      Here goes the problem selector

      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}

export default ProblemSelector;