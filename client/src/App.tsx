import axios from "axios";
import { ConnectedRouter } from "connected-react-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import VehicleLogs from "./components/VehicleLogs";
import AlertDataPage from "./pages/AlertDataPage";
import IncidentPage from "./pages/IncidentPage";
import LoginPage from "./pages/LoginPage";
import ManageDevice from "./pages/ManageDevice";
import ManageUser from "./pages/ManageUser";
import ProfilePage from "./pages/ProfilePage";
import PulseMessagePage from "./pages/PulseMessagePage";
import Statistics from "./pages/Statistics";
// import Statistics from "./pages/Statistics.jsx";
import TestMap from "./pages/TestMap";
import { checkLogin } from "./redux/login/thunk";
import { history, IRootState } from "./redux/store";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";

function App() {
  const token = localStorage.getItem("token");

  // Axios setups
  axios.defaults.baseURL = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_VERSION}`;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.get["Content-Type"] =
    "application/json; charset=utf-8";
  axios.defaults.headers.post["Content-Type"] =
    "application/json; charset=utf-8";

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: IRootState) => state.login.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn === null) {
      dispatch(checkLogin());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="App">
      <ConnectedRouter history={history}>
        <div className="fixOnPage">
          <NavBar />
        </div>
        <Switch>
          {/* <Route path="/" exact={true} component={LandingPage} /> */}
          {/* <Route path="/alertData" exact={true} component={AlertDataPage} /> */}

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" exact={true} component={LoginPage} />
          {isLoggedIn && (
            <>
              <AdminPrivateRoute
                path="/alert-data-page"
                exact={true}
                component={AlertDataPage}
              />
              <AdminPrivateRoute
                path="/pulse-message"
                exact={true}
                component={PulseMessagePage}
              />
              <AdminPrivateRoute
                path="/incident/:id"
                exact={true}
                component={IncidentPage}
              />
              <AdminPrivateRoute
                path="/profile/:id"
                exact={true}
                component={ProfilePage}
              />
              <AdminPrivateRoute
                path="/manage-user"
                exact={true}
                component={ManageUser}
              />
              <AdminPrivateRoute
                path="/manage-device"
                exact={true}
                component={ManageDevice}
              />
              <AdminPrivateRoute
                path="/statistics"
                exact={true}
                component={Statistics}
              />
              <AdminPrivateRoute
                path="/vehicle-logs/:id"
                exact={true}
                component={VehicleLogs}
              />
              <AdminPrivateRoute
                path="/test-map"
                exact={true}
                component={TestMap}
              />
            </>
          )}
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
