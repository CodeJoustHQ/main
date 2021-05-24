import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../util/Hook';
import { getAccount } from '../../api/Account';
import { setAccount } from '../../redux/Account';
import ErrorMessage from '../../components/core/Error';
import Loading from '../../components/core/Loading';
import MyProblems from './MyProblems';

enum DashboardTab {
  PROBLEMS, GAME_HISTORY, SUGGEST_FEATURE,
}

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
    <div>
      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <MyProblems loading={loading} />
    </div>
  );
}

export default DashboardPage;
