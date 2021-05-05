import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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
  const { component: Component, layout: Layout, ...rest } = props;

  const { account } = useAppSelector((state) => state);

  return (
    <Route
      {...rest}
      render={(renderProps) => (
        !account ? (
          <Redirect to="/login" />
        ) : (
          <Layout {...renderProps}>
            <Component {...renderProps} />
          </Layout>
        )
      )}
    />
  );
}
