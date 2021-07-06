import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AlertDataPage from "./pages/AlertDataPage";
import NavBar from "./components/NavBar";
import { ConnectedRouter } from "connected-react-router";
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
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
