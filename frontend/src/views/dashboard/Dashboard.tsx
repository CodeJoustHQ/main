import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../util/Hook';
import { getAccount } from '../../api/Account';
import { setAccount } from '../../redux/Account';
import ErrorMessage from '../../components/core/Error';
import Loading from '../../components/core/Loading';
import MyProblems from './MyProblems';
import DashboardSidebar from './DashboardSidebar';

export enum DashboardTab {
  PROBLEMS, GAME_HISTORY, SUGGEST_FEATURE,
}

const Content = styled.div`
  padding-top: 60px;
  padding-bottom: 50px;
`;

const RightContent = styled.div`
  // [Dashboard: left + width] + [Problem Card: margin]
  margin-left: 350px;
`;

const InnerContent = styled.div`
  width: 80%;
`;

function DashboardPage() {
  const dispatch = useAppDispatch();

  const { firebaseUser, token } = useAppSelector((state) => state.account);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<DashboardTab>(DashboardTab.PROBLEMS);

  useEffect(() => {
    if (firebaseUser && token) {
      setLoading(true);
      getAccount(firebaseUser.uid, token)
        .then((res) => dispatch(setAccount(res)))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [dispatch, firebaseUser, token]);

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
