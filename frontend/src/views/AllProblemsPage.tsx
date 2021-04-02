import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getProblems, Problem } from '../api/Problem';
import { LargeText } from '../components/core/Text';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import ProblemCard from '../components/card/ProblemCard';
import { TextLink } from '../components/core/Link';

const Content = styled.div`
  padding: 0 20%;
`;

function AllProblemsPage() {
  const history = useHistory();
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Variable to hold whether the user is focused on the text input field.
  const [focusInput, setFocusInput] = useState(false);

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
          onFocus={() => {
            setFocusInput(true);
          }}
          onBlur={() => {
            setFocusInput(false);
          }}
          onKeyPress={(event: React.ChangeEvent<HTMLInputElement>) => {
            setError('');
            if (event.key === 'Enter') {
              alert(event.target.value);
            }
          }}
        />
        <PrimaryInput
          onClick={() => {
            alert(password);
          }}
          value="Enter"
          disabled={!password}
        />
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
