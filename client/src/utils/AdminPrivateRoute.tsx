import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { IRootState } from "../redux/store";

function AdminPrivateRoute({ component, ...rest }: RouteProps) {
  const isLoggedIn = useSelector((state: IRootState) => state.login.isLoggedIn);
  const Component = component;
  if (Component == null) {
    return null;
  }
  let render: (props: any) => JSX.Element;
  if (isLoggedIn) {
    render = (props: any) => <Component {...props} />;
  } else {
    render = (props: any) => (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      />
    );
  }

  return <Route {...rest} render={render} />;
}

export default AdminPrivateRoute;
