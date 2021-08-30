import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import VehicleLogs from "./components/VehicleLogs";
import { REACT_APP_API_SERVER, REACT_APP_API_VERSION } from "./helpers/processEnv";
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
  const isLoggedIn = useSelector((state: IRootState) => state.login.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn === null) {
      dispatch(checkLogin());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="App">
      <div className="fixOnPage">
        <NavBar />
      </div>
      <Switch>
        <Route exact path="/">
          <Redirect to="/latest-locations" />
        </Route>
        <Route path="/login" exact component={LoginPage} />
        {isLoggedIn && (
          <>
            <AdminPrivateRoute path="/latest-locations" exact component={TestMap} />
            <AdminPrivateRoute path="/alert-data-page" exact component={AlertDataPage} />
            <AdminPrivateRoute path="/pulse-message" exact component={PulseMessagePage} />
            <AdminPrivateRoute path="/incident/:id" exact component={IncidentPage} />
            <AdminPrivateRoute path="/profile/:id" exact component={ProfilePage} />
            <AdminPrivateRoute path="/manage-user" exact component={ManageUser} />
            <AdminPrivateRoute path="/manage-device" exact component={ManageDevice} />
            <AdminPrivateRoute path="/statistics" exact component={Statistics} />
            <AdminPrivateRoute path="/vehicle-logs/:id" exact component={VehicleLogs} />
          </>
        )}
      </Switch>
    </div>
  );
}

export default App;
