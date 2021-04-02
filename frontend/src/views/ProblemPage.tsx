import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  accessProblems,
  editProblem,
  getSingleProblem,
  Problem,
} from '../api/Problem';
import NotFound from './NotFound';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemDisplay from '../components/problem/ProblemDisplay';
import { checkLocationState, generateRandomId } from '../util/Utility';
import LockScreen from '../components/core/LockScreen';

const Content = styled.div`
  display: flex;
`;

type ProblemParams = {
  id: string,
};

type LocationState = {
  locked: boolean,
};

function ProblemPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams<ProblemParams>();

  // The problems page is locked until a valid password is supplied.
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (checkLocationState(location, 'locked')) {
      setLocked(location.state.locked);
    }
  }, [location]);

  const sendAccessSpecificProblem = (passwordParam: string) => {
    setLoading(true);
    setError('');
    accessProblems(passwordParam)
      .then((access: boolean) => {
        setLoading(false);
        if (access) {
          // Push to history to give access with location on refresh.
          history.push(`/problem/${params.id}`, {
            locked: false,
          });
        } else {
          setError('The password was incorrect; please contact support@codejoust.co if you wish to help edit problems.');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    if (!locked) {
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
    }
  }, [params, locked]);

  if (!problem) {
    if (locked) {
      return (
        <LockScreen
          loading={loading}
          error={error}
          enterPasswordAction={sendAccessSpecificProblem}
        />
      );
    }
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
