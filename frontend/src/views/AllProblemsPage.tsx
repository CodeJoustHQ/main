import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { accessProblems, getProblems, Problem } from '../api/Problem';
import { Text, LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemCard from '../components/card/ProblemCard';
import LockScreen from '../components/core/LockScreen';
import { checkLocationState } from '../util/Utility';

const Content = styled.div`
  padding: 0 20%;
`;

const TextLinkLocation = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`;

type LocationState = {
  locked: boolean,
};

function AllProblemsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // The problems page is locked until a valid password is supplied.
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (checkLocationState(location, 'locked')) {
      setLocked(location.state.locked);
    }
  }, [location]);

  useEffect(() => {
    if (!locked) {
      setLoading(true);
      getProblems()
        .then((res) => {
          setProblems(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [locked]);

  const sendAccessProblems = (passwordParam: string) => {
    setLoading(true);
    setError('');
    accessProblems(passwordParam)
      .then((access: boolean) => {
        setLoading(false);
        if (access) {
          // Push to history to give access with location on refresh.
          history.push('/problems/all', {
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

  const redirect = (problemId: string) => {
    history.push(`/problem/${problemId}`, {
      locked: false,
    });
  };

  return (
    locked ? (
      <LockScreen
        loading={loading}
        error={error}
        enterPasswordAction={sendAccessProblems}
      />
    ) : (
      <Content>
        <LargeText>View All Problems</LargeText>
        <TextLinkLocation
          onClick={() => {
            history.push('/problem/create', {
              locked: false,
            });
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
    )
  );
}

export default AllProblemsPage;
