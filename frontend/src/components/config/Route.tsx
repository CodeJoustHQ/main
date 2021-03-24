import React from 'react';
import { Redirect, Route } from 'react-router-dom';

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
