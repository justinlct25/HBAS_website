import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import GlobalModal from "./components/Modal/GlobalModal";
import NavBar from "./components/NavBar";
import VehicleLogs from "./components/VehicleLogs";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "./helpers/processEnv";
import AlertDataPage from "./pages/AlertDataPage";
import ErrorPage from "./pages/ErrorPage";
import IncidentPage from "./pages/IncidentPage";
import LoginPage from "./pages/LoginPage";
import ManageDevice from "./pages/ManageDevice";
import ManageUser from "./pages/ManageUser";
import ProfilePage from "./pages/ProfilePage";
import PulseMessagePage from "./pages/PulseMessagePage";
import Statistics from "./pages/Statistics";
import TestMap from "./pages/TestMap";
import { checkLogin } from "./redux/login/thunk";
import { IRootState } from "./redux/store";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";

function App() {
  const token = localStorage.getItem("token");

  // Axios setups
  axios.defaults.baseURL = `${REACT_APP_API_SERVER}${REACT_APP_API_VERSION}`;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.get["Content-Type"] = "application/json; charset=utf-8";
  axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";

  const dispatch = useDispatch();
  const login = useSelector((state: IRootState) => state.login);
  const isLoggedIn = login.isLoggedIn;
  const role = login.role;

  useEffect(() => {
    if (isLoggedIn === null) {
      dispatch(checkLogin());
    }
  }, [dispatch, isLoggedIn]);

  const adminRoutes = [
    { path: "/manage-device", component: ManageDevice },
    { path: "/statistics", component: Statistics },
    { path: "/vehicle-logs/:id", component: VehicleLogs },
  ];

  return (
    <div className="App">
      <div className="fixOnPage">
        <NavBar />
        <GlobalModal />
      </div>
      {!isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Redirect to="/latest-locations" />
          </Route>
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      ) : (
        <Switch>
          <AdminPrivateRoute path="/latest-locations" exact component={TestMap} />
          <AdminPrivateRoute path="/alert-data-page" exact component={AlertDataPage} />
          <AdminPrivateRoute path="/pulse-message" exact component={PulseMessagePage} />
          <AdminPrivateRoute path="/incident/:id" exact component={IncidentPage} />
          <AdminPrivateRoute path="/profile/:id" exact component={ProfilePage} />
          <AdminPrivateRoute path="/manage-user" exact component={ManageUser} />
          {role === "ADMIN" &&
            adminRoutes.map((item) => {
              return <AdminPrivateRoute path={item.path} exact component={item.component} />;
            })}
          <Route component={ErrorPage} />
        </Switch>
      )}
    </div>
  );
}

export default App;
