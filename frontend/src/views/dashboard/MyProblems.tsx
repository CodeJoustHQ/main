import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { MainHeaderText } from '../../components/core/Text';
import ProblemCard from '../../components/card/ProblemCard';
import { TextLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';
import { FlexHorizontalContainer, FlexLeft, RelativeContainer } from '../../components/core/Container';
import { GreenSmallButton } from '../../components/core/Button';

type MyProblemsProps = {
  loading: boolean,
};

const Content = styled.div`
  text-align: left;
`;

const TopText = styled.div`
  padding: 0 10px;
`;

const MyProblemsText = styled(MainHeaderText)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.darkText};
  margin: 0;
`;

const CreateButton = styled(GreenSmallButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

function MyProblems(props: MyProblemsProps) {
  const { loading } = props;

  const history = useHistory();
  const { account } = useAppSelector((state) => state.account);

  return (
    <Content>
      <TopText>
        <FlexHorizontalContainer>
          <FlexLeft>
            <div>
              <MyProblemsText>My Problems</MyProblemsText>
              <TextLink to="/problems/all">
                Or browse our public collection &#8594;
              </TextLink>
            </div>
          </FlexLeft>
          <RelativeContainer>
            <CreateButton onClick={() => history.push('/problem/create')}>
              Create
            </CreateButton>
          </RelativeContainer>
        </FlexHorizontalContainer>
      </TopText>
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
    </Content>
  );
}

export default MyProblems;
