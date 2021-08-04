import { ConnectedRouter } from "connected-react-router";
import React from "react";
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
import Statistics from "./pages/Statistics";
// import Statistics from "./pages/Statistics.jsx";
import TestMap from "./pages/TestMap";
import { history } from "./redux/store";

function App() {
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
          <Route
            path="/alert-data-page"
            exact={true}
            component={AlertDataPage}
          />
          <Route path="/incident/:id" exact={true} component={IncidentPage} />
          <Route path="/profile/:id" exact={true} component={ProfilePage} />
          <Route path="/manage-user" exact={true} component={ManageUser} />
          <Route path="/manage-device" exact={true} component={ManageDevice} />
          <Route path="/statistics" exact={true} component={Statistics} />
          <Route
            path="/vehicle-logs/:id"
            exact={true}
            component={VehicleLogs}
          />
          <Route path="/test-map" exact={true} component={TestMap} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
