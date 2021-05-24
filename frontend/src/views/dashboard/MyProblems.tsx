import React from 'react';
import { useHistory } from 'react-router-dom';
import { MainHeaderText } from '../../components/core/Text';
import ProblemCard from '../../components/card/ProblemCard';
import { TextLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';

type MyProblemsProps = {
  loading: boolean,
};

function MyProblems(props: MyProblemsProps) {
  const { loading } = props;

  const history = useHistory();
  const { account } = useAppSelector((state) => state.account);

  return (
    <>
      <MainHeaderText>My Problems</MainHeaderText>
      {account?.problems.map((problem, index) => (
        <ProblemCard
          key={index}
          problem={problem}
          onClick={() => history.push(`/problem/${problem.problemId}`)}
        />
      ))}

      {!loading && !account?.problems.length ? (
        <>
          <p>You do not have any problems.</p>
          <TextLink to="/problem/create">
            Create one now &#8594;
          </TextLink>
        </>
      ) : null}
    </>
  );
}

export default MyProblems;
