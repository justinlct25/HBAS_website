import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import AlertDataPage from "./pages/AlertDataPage";
import ManageDevice from "./pages/ManageDevice";
import ManageUser from "./pages/ManageUser";
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
          <Route path="/" exact={true} component={AlertDataPage} />
          <Route path="/manageUser" exact={true} component={ManageUser} />
          <Route path="/manageDevice" exact={true} component={ManageDevice} />
          <Route path="/statistics" exact={true} component={Statistics} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
