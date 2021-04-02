import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { accessProblems, getProblems, Problem } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemCard from '../components/card/ProblemCard';
import { TextLink } from '../components/core/Link';
import { LargeCenterInputText, PrimaryInput } from '../components/core/Input';

const Content = styled.div`
  padding: 0 20%;
`;

function AllProblemsPage() {
  const history = useHistory();
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // The problems page is locked until a valid password is supplied.
  const [locked, setLocked] = useState(true);
  const [password, setPassword] = useState('');

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

  const sendAccessProblems = (passwordParam: string) => {
    accessProblems(passwordParam)
      .then((access: boolean) => {
        if (access) {
          setLocked(false);
        } else {
          setError('The password was incorrect; please contact support@codejoust.co if you wish to help edit problems.');
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const redirect = (problemId: string) => {
    history.push(`/problem/${problemId}`);
  };

  return (
    locked ? (
      <Content>
        <LargeText>
          What is the password?
        </LargeText>
        <LargeCenterInputText
          placeholder="Your nickname"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
          onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
            setError('');
            if (event.key === 'Enter') {
              sendAccessProblems(password);
            }
          }}
        />
        <PrimaryInput
          onClick={() => {
            sendAccessProblems(password);
          }}
          value="Enter"
          disabled={!password}
        />
        { error ? <ErrorMessage message={error} /> : null }
      </Content>
    ) : (
      <Content>
        <LargeText>View All Problems</LargeText>
        <TextLink to="/problem/create">Create new problem</TextLink>
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
