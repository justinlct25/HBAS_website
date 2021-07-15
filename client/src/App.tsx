import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import AlertDataPage from "./pages/AlertDataPage";
import IncidentPage from "./pages/IncidentPage";
import LoginPage from "./pages/LoginPage";
import ManageDevice from "./pages/ManageDevice";
import ManageUser from "./pages/ManageUser";
import ProfilePage from "./pages/ProfilePage";
import Statistics from "./pages/Statistics";
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
          <Route path="/alertDataPage" exact={true} component={AlertDataPage} />
          <Route path="/incident/:id" exact={true} component={IncidentPage} />
          <Route path="/profile" exact={true} component={ProfilePage} />
          <Route path="/manageUser" exact={true} component={ManageUser} />
          <Route path="/manageDevice" exact={true} component={ManageDevice} />
          <Route path="/statistics" exact={true} component={Statistics} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
