import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import {
  createProblem,
  Problem,
  ProblemIOType,
  sendAccessProblemPartial,
} from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/ProblemDisplay';
import { Difficulty } from '../api/Difficulty';
import { checkLocationState } from '../util/Utility';
import LockScreen from '../components/core/LockScreen';

type LocationState = {
  locked: boolean,
};

const Content = styled.div`
  display: flex;
`;

function CreateProblemPage() {
  const firstProblem = {
    problemId: '',
    name: '',
    description: '',
    approval: false,
    difficulty: Difficulty.Easy,
    testCases: [],
    problemInputs: [],
    problemTags: [],
    outputType: ProblemIOType.Integer,
  };

  const history = useHistory();
  const location = useLocation<LocationState>();
  const [problem, setProblem] = useState<Problem>(firstProblem);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // The problems page is loading or locked until a valid password is supplied.
  const [locked, setLocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (checkLocationState(location, 'locked')) {
      setLocked(location.state.locked);
    } else {
      setLocked(true);
    }
  }, [location]);

  const handleSubmit = (newProblem: Problem) => {
    setLoading(true);
    setError('');

    createProblem(newProblem)
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

  // Display loading page while locked value is being calculated.
  if (locked === null) {
    return <Loading />;
  }

  return (
    locked ? (
      <LockScreen
        loading={loading}
        error={error}
        enterPasswordAction={sendAccessProblemPartial(
          '/problem/create',
          history,
          setLoading,
          setError,
        )}
      />
    ) : (
      <>
        <LargeText>Create Problem</LargeText>
        { error ? <ErrorMessage message={error} /> : null }
        { loading ? <Loading /> : null }
        <Content>
          <ProblemDisplay problem={problem!} onClick={handleSubmit} actionText="Create" editMode={false} />
        </Content>
      </>
    )
  );
}

export default CreateProblemPage;
