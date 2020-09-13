import React from 'react';
import { Route } from 'react-router-dom';

function CustomRoute(props: any) {
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

export default CustomRoute;
