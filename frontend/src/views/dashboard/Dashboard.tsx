import React, { useEffect, useState } from 'react';
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
  padding-bottom: 50px;
`;

const RightContent = styled.div`
  // [Dashboard: left + 2*padding + width] + [Problem Card: margin]
  margin-left: 380px;
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

  return (
    <Content>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <br />
      <br />
      <DashboardSidebar tab={tab} />
      <RightContent>
        <InnerContent>
          <MyProblems loading={loading} />
        </InnerContent>
      </RightContent>
    </Content>
  );
}

export default DashboardPage;
