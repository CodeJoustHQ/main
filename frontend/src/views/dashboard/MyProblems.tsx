import React from 'react';
import styled from 'styled-components';
import { MainHeaderText, SecondaryHeaderText } from '../../components/core/Text';
import { GreenSmallButtonLink, TextLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';
import {
  CenteredContainer,
  FlexHorizontalContainer,
  FlexLeft,
  RelativeContainer,
} from '../../components/core/Container';
import FilteredProblemList from '../../components/problem/FilteredProblemList';

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

const CreateButtonLink = styled(GreenSmallButtonLink)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

function MyProblems(props: MyProblemsProps) {
  const { loading } = props;

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
            <CreateButtonLink to="/problem/create">
              Create
            </CreateButtonLink>
          </RelativeContainer>
        </FlexHorizontalContainer>
      </TopText>

      <FilteredProblemList problems={account?.problems || []} />

      {!loading && !account?.problems.length ? (
        <CenteredContainer>
          <SecondaryHeaderText>
            You have not written any problems. Create your first or browse our public collection!
          </SecondaryHeaderText>
        </CenteredContainer>
      ) : null}
    </Content>
  );
}

export default MyProblems;
