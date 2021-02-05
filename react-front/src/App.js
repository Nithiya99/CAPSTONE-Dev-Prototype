import React, { Component } from "react";
import MainRouter from "./MainRouter";
import { BrowserRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Signin from "./user/Signin";
import { isAuthenticated } from "./auth/index";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Signin}></Route>
        </Switch>
        <MainRouter />
      </BrowserRouter>
    );
  }
}

export default App;
