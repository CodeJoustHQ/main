import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../util/Hook';
import { fetchAccount } from '../../redux/Account';
import ErrorMessage from '../../components/core/Error';
import Loading from '../../components/core/Loading';
import MyProblems from './MyProblems';
import DashboardSidebar from './DashboardSidebar';

export enum DashboardTab {
  PROBLEMS, GAME_HISTORY, SUGGEST_FEATURE,
}

const Content = styled.div`
  padding: 50px 30px;
  display: flex;
  flex-direction: row;
  width: calc(85% - 60px);
  margin: 0 auto;
`;

const RightContent = styled.div`
  padding: 0 20px;
  flex: 1;
`;

const InnerContent = styled.div`
  width: 100%;
`;

function DashboardPage() {
  const dispatch = useAppDispatch();

  const { account } = useAppSelector((state) => state.account);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<DashboardTab>(DashboardTab.PROBLEMS);

  useEffect(() => {
    if (!account) {
      setLoading(true);
      dispatch(fetchAccount())
        .then(unwrapResult)
        .catch((err) => setError(err.message));
    } else {
      setLoading(false);
    }
  }, [dispatch, account]);

  const getDisplay = useCallback(() => {
    switch (tab) {
      case DashboardTab.PROBLEMS:
        return <MyProblems loading={loading} />;
      case DashboardTab.GAME_HISTORY:
        return <p>Game History page (coming soon!)</p>;
      case DashboardTab.SUGGEST_FEATURE:
        return <p>If the link did not open, submit feedback here: https://airtable.com/shrGkEhC6RhAxRCxG</p>;
      default:
        return <p>Congrats! You found an unreachable page</p>;
    }
  }, [tab, loading]);

  return (
    <Content>
      <DashboardSidebar tab={tab} onClick={setTab} />
      <RightContent>
        <InnerContent>
          {getDisplay()}
          { error ? <ErrorMessage message={error} /> : null }
          { loading ? <Loading /> : null }
        </InnerContent>
      </RightContent>
    </Content>
  );
}

export default DashboardPage;
