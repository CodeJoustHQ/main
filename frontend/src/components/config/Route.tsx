import React from 'react';
import {
  Redirect, Route, useHistory, useLocation,
} from 'react-router-dom';
import { useAppSelector } from '../../util/Hook';

export function CustomRoute(props: any) {
  const { component: Component, layout: Layout, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(renderProps) => (
        <Layout {...renderProps}>
          <Component {...renderProps} />
        </Layout>
      )}
    />
  );
}

// Redirect preserving the query string.
export function CustomRedirect(props: any) {
  const { to, from, location } = props;
  const newTo: string = `${to}${location.search}`;
  return (
    <Redirect to={newTo} from={from} />
  );
}

export function PrivateRoute(props: any) {
  const history = useHistory();
  const location = useLocation();

  const { account } = useAppSelector((state) => state);

  if (!account) {
    history.replace('/login', { from: location.pathname + location.search });
  }

  return <CustomRoute {...props} />;
}
