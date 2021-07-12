import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  LowMarginText,
  MainHeaderText,
  NoMarginMediumText,
  SecondaryHeaderText,
} from '../../components/core/Text';
import { GreenSmallButtonLink, TextLink, InheritedTextLink } from '../../components/core/Link';
import { useAppDispatch, useAppSelector } from '../../util/Hook';
import {
  CenteredContainer,
  FlexHorizontalContainer,
  FlexLeft,
  RelativeContainer,
} from '../../components/core/Container';
import FilteredProblemList from '../../components/problem/FilteredProblemList';
import { fetchAccount } from '../../redux/Account';

type MyProblemsProps = {
  loading: boolean,
};

const Content = styled.div`
  text-align: left;
`;

const TopTextContainer = styled.div`
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

  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccount());
  }, []);

  return (
    <Content>
      <TopTextContainer>
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
      </TopTextContainer>

      <FilteredProblemList problems={account?.problems || []} />

      {!loading && !account?.problems.length ? (
        <CenteredContainer>
          <NoMarginMediumText>It looks like you&apos;re new here!</NoMarginMediumText>
          <LowMarginText>Follow these steps to get started:</LowMarginText>
          <br />

          <SecondaryHeaderText>
            <b>Step 1.</b>
            {' '}
            <InheritedTextLink to="/problem/create">Create your first problem</InheritedTextLink>
            , or browse our
            {' '}
            <InheritedTextLink to="/problems/all">official collection</InheritedTextLink>
            {' '}
            for inspiration.
          </SecondaryHeaderText>

          <SecondaryHeaderText>
            <b>Step 2.</b>
            {' '}
            <InheritedTextLink to="/game/create">Create a room</InheritedTextLink>
            {' '}
            and choose what problems you want your students to solve.
          </SecondaryHeaderText>

          <SecondaryHeaderText>
            <b>Step 3.</b>
            {' '}
            Invite your students to the room and start the game whenever you&apos;re ready!
          </SecondaryHeaderText>
        </CenteredContainer>
      ) : null}
    </Content>
  );
}

export default MyProblems;
