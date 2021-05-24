import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../util/Hook';
import { getAccount } from '../../api/Account';
import { setAccount } from '../../redux/Account';
import ErrorMessage from '../../components/core/Error';
import Loading from '../../components/core/Loading';
import MyProblems from './MyProblems';
import DashboardSidebar from './DashboardSidebar';
import { Row, Column } from '../../components/core/Grid';

export enum DashboardTab {
  PROBLEMS, GAME_HISTORY, SUGGEST_FEATURE,
}

const Content = styled.div`
  position: relative;
  height: 85vh;
  padding: 20px;
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
      <Row>
        <Column>
          <DashboardSidebar tab={tab} />
        </Column>
        <Column>
          <MyProblems loading={loading} />
        </Column>
      </Row>
    </Content>
  );
}

export default DashboardPage;
